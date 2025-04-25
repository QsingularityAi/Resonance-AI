"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.2.0
Initial version: 1.0.0 (2024-07-14)
"""
import time
from hw_rag.services.openai_service import OpenAIService, GPTModel
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI
import asyncio
import json
import logging
from dataclasses import dataclass
from itertools import product
import random
from django.template.loader import render_to_string
from pydantic import BaseModel
from typing import Literal

class Score(BaseModel):
    reasoning: str
    winner: str
    winner_difference: Literal["Low", "Medium", "High"]
    error: str | None = None


@dataclass
class OrderedAnswers:
    first: str
    first_label: Literal["Red", "Blue"]
    second: str
    second_label: Literal["Red", "Blue"]

class NotWellDefinedException(Exception):
    def __init__(self):
        super().__init__("Question is not well formed")


class Benchmark:
    @inject
    def __init__(self, openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.openai_service = openai_service
        self.sem = asyncio.Semaphore(50)
        self.logger = logging.getLogger(__name__)

    def load_json_file(self, file_path: str) -> list:
        try:
            with open(file_path, 'rb') as file:
                content_data = file.read().decode('utf-8')
                return json.loads(content_data)
        except json.decoder.JSONDecodeError as e:
            self.logger.warning(f"{file_path} could not be loaded: {e.msg}")
            return []

    async def async_handle(self, file_a_path, file_b_path):
        logger = logging.getLogger(__name__)
        self.openai_service.update_concurrency_limit(100)

        questions_a = self.load_json_file(file_a_path)
        questions_b = self.load_json_file(file_b_path)

        try:
            tasks_info = await self._create_scoring_tasks(questions_a, questions_b)
            logger.warning("normal order:")

            total = len(tasks_info)
            progress_data = {
                'start_time': time.time(),
                'last_update': time.time(),
                'total': total
            }

            logger.warning(f"Progress: 0/{total} [0%] 0.00it/s cost: {self.openai_service.total_cost:.2f}¢")

            # Create and start tasks in batches
            all_tasks = []
            batch_size = 50

            for i in range(0, total, batch_size):
                batch = tasks_info[i:i + batch_size]
                batch_tasks = [
                    asyncio.create_task(self.score_answer(
                        task["answer_a"],
                        task["answer_b"],
                        task["question"]
                    ))
                    for task in batch
                ]
                all_tasks.extend(batch_tasks)
                await asyncio.sleep(0)

            scoring_tasks = [
                {
                    "task": task,
                    **tasks_info[i]
                }
                for i, task in enumerate(all_tasks)
            ]

            async def monitor_progress():
                while True:
                    completed = sum(1 for t in all_tasks if t.done())
                    current_time = time.time()

                    if current_time - progress_data['last_update'] >= 5 or completed == total:
                        # Get results from completed tasks
                        a_wins = 0
                        b_wins = 0
                        a_score = 0
                        b_score = 0

                        for task in all_tasks:
                            if task.done():
                                try:
                                    result, _ = task.result()
                                    if result.winner == "Red":
                                        a_wins += 1
                                        score = {"Low": 1, "Medium": 2, "High": 3}[result.winner_difference]
                                        a_score += score
                                    elif result.winner == "Blue":
                                        b_wins += 1
                                        score = {"Low": 1, "Medium": 2, "High": 3}[result.winner_difference]
                                        b_score += score
                                except:
                                    continue

                        # Calculate performance metrics
                        total_wins = a_wins + b_wins
                        b_win_rate = (b_wins / total_wins * 100) if total_wins > 0 else 0
                        b_win_performance = (b_win_rate / 50) * 100 if total_wins > 0 else 0
                        b_score_performance = (b_score / a_score * 100) if a_score > 0 else 0

                        elapsed = current_time - progress_data['start_time']
                        rate = completed / elapsed if elapsed > 0 else 0

                        logger.warning(
                            f"Progress: {completed}/{total} [{completed * 100 // total}%] "
                            f"{rate:.2f}it/s | B perf wins: {b_win_performance:.1f}% score: {b_score_performance:.1f}% | "
                            f"cost: {openai.total_cost:.2f}¢"
                        )
                        progress_data['last_update'] = current_time

                    if completed == total:
                        break

                    await asyncio.sleep(1)

            monitor = asyncio.create_task(monitor_progress())
            results = await asyncio.gather(*all_tasks, return_exceptions=True)
            await monitor

            # Use the global cost directly
            stats = self._process_results(results, scoring_tasks)
            stats['total_cost'] = openai.total_cost

            self._log_results(logger, stats, file_a_path, file_b_path)
            self._write_summary(stats)

            return stats

        except Exception as e:
            logger.error(f"Error in async_handle: {e}")
            raise

    async def _create_scoring_tasks(self, questions_a, questions_b):
        tasks = []
        for qa, qb in zip(questions_a, questions_b):
            try:
                if not self._is_valid_question(qa) or not self._is_valid_question(qb):
                    raise NotWellDefinedException()

                if qa["question"] != qb["question"]:
                    self.stdout.write(f"Questions don't match: {qa['question']} vs {qb['question']}")
                    continue

                # Convert answers to lists if they're not already
                answers_a = qa["answer"] if isinstance(qa["answer"], list) else [qa["answer"]]
                answers_b = qb["answer"] if isinstance(qb["answer"], list) else [qb["answer"]]

                # Generate all unique combinations
                seen_pairs = set()
                for answer_a, answer_b in product(answers_a, answers_b):
                    # Create a sorted tuple to avoid duplicates
                    pair = tuple(sorted([answer_a, answer_b]))
                    if pair not in seen_pairs and answer_a != answer_b:
                        seen_pairs.add(pair)
                        # Don't create the task yet, just store the parameters
                        tasks.append({
                            "qa": qa,
                            "answer_a": answer_a,
                            "answer_b": answer_b,
                            "question": qa["question"]
                        })

            except NotWellDefinedException:
                self.stdout.write("Question not well defined, missing answer or question")
                continue
        tasks.extend(tasks)  # process everything twice
        tasks.extend(tasks)  # process everything twice
        return tasks

    def _process_results(self, results, scoring_tasks):
        summary = []
        stats = {
            "a_wins": 0,
            "b_wins": 0,
            "a_score": 0,
            "b_score": 0,
            "valid_comparisons": 0,
            "total_cost": 0
        }

        def convert_difference_to_score(difference: str) -> int:
            score_map = {"Low": 1, "Medium": 2, "High": 3}
            return score_map.get(difference, 0)

        for result in results:
            if isinstance(result, tuple) and len(result) == 2:
                score_result, cost = result
                stats["total_cost"] += cost

                numeric_score = convert_difference_to_score(score_result.winner_difference)

                if score_result.winner == "Red":
                    stats["a_wins"] += 1
                    stats["a_score"] += numeric_score
                elif score_result.winner == "Blue":
                    stats["b_wins"] += 1
                    stats["b_score"] += numeric_score

                stats["valid_comparisons"] += 1

                summary.append({
                    "question": scoring_tasks[len(summary)]["qa"]["question"],
                    "answer_a": scoring_tasks[len(summary)]["answer_a"],
                    "answer_b": scoring_tasks[len(summary)]["answer_b"],
                    "scoring": score_result.dict()
                })

        stats["summary"] = summary
        return stats

    def _log_results(self, logger, stats, file_a_path, file_b_path):
        total_comparisons = stats['a_wins'] + stats['b_wins']
        b_win_rate = (stats['b_wins'] / total_comparisons * 100) if total_comparisons > 0 else 0

        # Win-based performance (50% win rate = 100% performance)
        b_win_performance = (b_win_rate / 50) * 100

        # Score-based performance where A is baseline 100%
        b_score_performance = (stats['b_score'] / stats['a_score'] * 100) if stats['a_score'] > 0 else 0

        logger.warning("\nFinal Results:")
        logger.warning(f"A wins: {stats['a_wins']} ({file_a_path})")
        logger.warning(f"B wins: {stats['b_wins']} ({file_b_path})")
        logger.warning(f"A score: {stats['a_score']}")
        logger.warning(f"B score: {stats['b_score']}")
        logger.warning(f"B win rate: {b_win_rate:.1f}%")
        logger.warning(f"B performance by wins: {b_win_performance:.1f}% (100% = equal to A)")
        logger.warning(f"B performance by score: {b_score_performance:.1f}% (100% = equal to A)")
        logger.warning(f"Total cost of request: {stats['total_cost']:.2f} cent")

    def _write_summary(self, stats):
        total_comparisons = stats['a_wins'] + stats['b_wins']
        b_win_rate = (stats['b_wins'] / total_comparisons * 100) if total_comparisons > 0 else 0
        b_win_performance = (b_win_rate / 50) * 100
        b_score_performance = (stats['b_score'] / stats['a_score'] * 100) if stats['a_score'] > 0 else 0

        with open("comparison_summary.json", 'w+') as file:
            json.dump({
                "results": stats["summary"],
                "statistics": {
                    "a_wins": stats["a_wins"],
                    "b_wins": stats["b_wins"],
                    "a_score": stats["a_score"],
                    "b_score": stats["b_score"],
                    "b_win_rate": round(b_win_rate, 1),
                    "b_performance_by_wins": round(b_win_performance, 1),
                    "b_performance_by_score": round(b_score_performance, 1)
                }
            }, file, indent=4)

    def _is_valid_question(self, question):
        return "question" in question and "answer" in question

    async def score_answer(self, red: str, blue: str, query: str, randomize: bool = True) -> tuple[Score, float]:
        # Fixed labels for each color
        def generate_label():
            return 'resp_' + ''.join(random.choices('123456789abcdef', k=4))

        red_label = generate_label()  # e.g. 'resp_a3b2'
        blue_label = generate_label()  # e.g. 'resp_f7d4'

        # Validation checks
        if not red.strip() or not blue.strip():
            return Score(winner="None", score=5, error="Empty answer detected"), 0
        if red.strip() == blue.strip():
            return Score(winner="None", score=5, error="Identical answers"), 0

        # Determine presentation order based on randomize parameter
        should_swap = randomize and random.random() < 0.5

        if should_swap:
            first_content = blue
            second_content = red
            first_label = blue_label
            second_label = red_label
            label_to_color = {blue_label: "Blue", red_label: "Red"}
        else:
            first_content = red
            second_content = blue
            first_label = red_label
            second_label = blue_label
            label_to_color = {red_label: "Red", blue_label: "Blue"}

        system_message = {
            "role": "system",
            "content": render_to_string('benchmark.html', {
                'first_label': first_label,
                'second_label': second_label
            })
        }

        user_message = {
            "role": "user",
            "content": f"""Compare these two answers to the question.

         Question: {query}

         ({first_label}):
         {first_content}
         ---

         ({second_label}):
         {second_content}
         ---
         """
        }
        # print(user_message)

        prompt_messages = [system_message, user_message]

        cost_before = self.openai_service.total_cost

        try:
            completion = await self.openai_service.acall_openai(
                prompt_messages,
                Score,
                GPTModel.GPT4O_MINI,
                temperature=0.5
            )

            # Map label back to color
            if completion.winner in label_to_color:
                completion.winner = label_to_color[completion.winner]

        except Exception as e:
            print(e)
            raise e

        return completion, self.openai_service.total_cost - cost_before

    def is_valid_question(self, qa, qb):
        return ("question" in qa and "answer" in qa and
                "question" in qb and "answer" in qb and
                qa["question"] == qb["question"])


