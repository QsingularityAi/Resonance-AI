"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.5.1
Initial version: 1.0.0 (2024-02-14) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import hashlib
import logging
import re
import shutil
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import List, Optional
from dataclasses import dataclass
from pypdf import PdfReader
from langchain.schema import Document

from hw_rag.dataclasses import QSource
from hw_rag.disk_data_writer import DiskReaderWriter


@dataclass
class PdfInfo:
    pages: int
    author: str = None
    title: str = None
    creation_date: Optional[datetime] = None


class PdfProcessor:
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.logger = logging.getLogger(__name__)

    def process_pdf(self, pdf_bytes: bytes, source: QSource, force_processing: bool = False,
                    images_relative: bool = False) -> List[Document]:
        pdf_page_count = self.add_pdf_info_to_source_and_get_page_count(pdf_bytes, source)
        pdf_checksum = self._get_md5_checksum(pdf_bytes)
        results_dir = self.data_dir / f"{pdf_checksum}_results"
        image_dir = results_dir / "figures"
        source_json_path = results_dir / "source.json"
        if results_dir.exists() and source_json_path.exists() and not force_processing:
            # Read cached results and convert to Documents
            return self._read_cached_results_as_documents(results_dir, source)

        if results_dir.exists():
            shutil.rmtree(results_dir)
        # Create results_dir and image_dir if they don't exist
        results_dir.mkdir(parents=True, exist_ok=True)
        image_dir.mkdir(parents=True, exist_ok=True)


        documents = []

        from magic_pdf.pipe.UNIPipe import UNIPipe

        for page_num in range(pdf_page_count):
            self.logger.info("Processing page " + str(page_num))
            jso_useful_key = {"_pdf_type": "", "model_list": []}
            image_writer = DiskReaderWriter(str(image_dir))
            pipe = UNIPipe(pdf_bytes,
                           jso_useful_key,
                           image_writer,
                           formula_enable=False,
                           start_page_id=page_num,
                           end_page_id=page_num,
                           lang='de',
                           layout_model='doclayout_yolo')
            pipe.pipe_classify()
            pipe.pipe_analyze()
            pipe.pipe_parse()
            md_content = pipe.pipe_mk_markdown(str(image_dir), drop_mode='none')
            if images_relative:
                md_content = re.sub(r'!\[\]\(.*figures/', r'![](figures/', md_content)

            # Create Langchain Document
            document = Document(
                page_content=md_content,
                metadata={
                    'source': source,
                    'page': page_num + 1
                }
            )
            documents.append(document)

            # Write individual page markdown to results directory
            with open(results_dir / f"page_{str(page_num + 1).zfill(4)}.md", "w", encoding="utf-8") as f:
                f.write(md_content)

        # the source.json also marks a successfull processed results dir

        with open(source_json_path, "w", encoding="utf-8") as f:
            f.write(source.model_dump_json(indent=2))

        return documents

    @staticmethod
    def add_pdf_info_to_source_and_get_page_count(pdf_bytes: bytes, source: QSource) -> int:
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)

        if reader.metadata is not None:
            if reader.metadata.title:
                source.title = reader.metadata.title
            if reader.metadata.creation_date:
                source.create_date = reader.metadata.creation_date

        pages = len(reader.pages)
        return pages

    def _read_cached_results_as_documents(self, results_dir, source: QSource) -> List[Document]:
        """Helper method to read cached results and convert them to Documents"""
        documents = []

        # Get all markdown files in the results directory
        markdown_files = sorted(results_dir.glob("page_*.md"))

        for file_path in markdown_files:
            # Extract page number from filename
            page_num = int(file_path.stem.split('_')[1])

            # Read the markdown content
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Create Langchain Document
            document = Document(
                page_content=content,
                metadata={
                    'source': source,
                    'page': page_num
                }
            )
            documents.append(document)

        return documents

    def _get_md5_checksum(self, data: bytes) -> str:
        md5_hash = hashlib.md5()
        md5_hash.update(data)
        return md5_hash.hexdigest()