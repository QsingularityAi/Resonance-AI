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
import json
import logging
import re
import uuid
from typing import List, Optional, Type

from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

from backend.tasks import process_qsource
from hw_rag.services.openai_service import OpenAIService, GPTModel
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI
from .image_processor import ImageProcessor
from langchain.schema import Document
from hw_rag.dataclasses import QDocType, QDocument, QSource, QSourceType
from pydantic import BaseModel


class TitleResult(BaseModel):
    candidates: List[str]
    most_likely_title: Optional[str]

class MarkdownProcessor:
    @inject
    def __init__(self, cache_dir: str, openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.image_processor = ImageProcessor(cache_dir=cache_dir)
        self.logger = logging.getLogger(__name__)
        self.openai_client = openai_service
        pass

    def process_markdown(self, markdowns: List[Document], knowledgebase_id: int):
        documents: List[QDocument] = []
        media_docs: List[QDocument] = []
        if markdowns[0].metadata['source'].title is None:
            self._guess_document_name(markdowns[0])

        for markdown in markdowns:
            # Search for image patterns matching ![](figures/...)
            full_text = markdown.page_content
            media_documents, media_metadata = self.process_links_in_ressource(full_text, knowledgebase_id,markdown)
            media_docs.extend(media_documents)
            markdown.metadata['images'] = media_metadata

            if ('source' in markdown.metadata
                    and hasattr(markdown.metadata['source'], 'metadata')
                    and isinstance(markdown.metadata['source'].metadata, dict)
                    and 'associated_ref_ids' in markdown.metadata['source'].metadata):
                markdown.metadata['associated_ref_ids'] = markdown.metadata['source'].metadata['associated_ref_ids']

        markdowns_by_header = self._split_markdown_by_header(markdowns)
        # in case the paragraphs below the headers are still too big
        processed_markdowns = []
        for markdown in markdowns_by_header:
            # Find markdown tables using regex
            table_pattern = r'\|.*\|[\r\n]+\|[-\s|]*\|[\r\n]+(\|.*\|[\r\n]+)+'
            matches = re.finditer(table_pattern, markdown.page_content)

            current_content = markdown.page_content
            offset = 0

            for match in matches:
                # Extract table and split into chunks
                table = match.group(0)
                table_chunks = self.split_markdown_table(table)

                # Remove original table from content
                start = match.start() - offset
                end = match.end() - offset
                current_content = current_content[:start] + current_content[end:]
                offset += end - start
                if "table" not in markdown.metadata:
                    markdown.metadata["table"] = str(uuid.uuid4())
                # Create new documents for table chunks
                for chunk in table_chunks:
                    table_doc = Document(
                        page_content=chunk,
                        metadata=markdown.metadata.copy()
                    )
                    processed_markdowns.append(table_doc)

            # Add document with remaining content
            if current_content.strip():
                remaining_doc = Document(
                    page_content=current_content,
                    metadata=markdown.metadata.copy()
                )
                processed_markdowns.append(remaining_doc)
        markdowns_splitted = self._split_documents_to_size(processed_markdowns)

        for markdown in markdowns_splitted:
            # Build header string from metadata if exists
            header_str = ""
            for i in range(1, 4):
                header_key = f"Header {i}"
                if header_key in markdown.metadata and markdown.metadata[header_key]:
                    header_str += f"{'#' * i} {markdown.metadata[header_key]}\n\n"

            # Combine headers with content
            markdown.page_content = header_str + markdown.page_content if header_str else markdown.page_content
            # Filter out source, reference_id and Header fields from metadata
        markdowns_merged = self._merge_small_chunks(markdowns_splitted)

        # reges for removing links: [^!]\[[^\]]*\]\w*\([^)]*\)

        # Process texts
        for markdown in markdowns_merged:
            if self.openai_client.tiktoken_len(markdown.page_content) < 60:
                # skip small chunks
                continue

            checksum = hashlib.md5(markdown.page_content.encode('utf-8')).hexdigest()

            content = markdown.page_content.replace("\*", "*")
            filtered_metadata = dict(filter(lambda item: item[0] not in {
                'Header 1',
                'Header 2',
                'Header 3',
                'source'
            }, markdown.metadata.items()))
            doc = QDocument(
                text=content,
                embedding_text=content,
                doc_type=QDocType.TEXT,
                reference_id=markdown.metadata['source'].reference_id,
                source=markdown.metadata['source'],
                checksum=checksum,
                metadata=filtered_metadata
            )
            documents.append(doc)
        return documents+media_docs


    def process_links_in_ressource(self, full_text, knowledgebase_id, markdown)->tuple[list[QDocument], list[str]]:
        link_pattern = r'!?\[(.*?)\]\((.*?)\)'
        matches = re.finditer(link_pattern, full_text)
        documents: List[QDocument] = []
        metadata: List[str] = []
        image_extensions = ["png", "jpg", "jpeg"]

        for match in matches:
            try:
                # Extract the image URL from the matched group
                link_url = match.group(2)
                if any(link_url.lower().endswith(ext) for ext in image_extensions):
                    # Now image_url contains the path from inside the parentheses
                    image_doc = self._process_image_link(full_text, link_url, knowledgebase_id, markdown, match)
                    markdown.page_content = markdown.page_content.replace(match.group(0), "")
                    if not image_doc:
                        # design element, processing error or offensive
                        continue
                    metadata += [image_doc.checksum]
                    documents.append(image_doc)
            except Exception as e:
                self.logger.error(f"Error processing found link {match.group(1)}: {str(e)}", exc_info=True)


        return  documents, metadata

    def _process_image_link(self, full_text, image_url, knowledgebase_id, markdown, match):
        self.logger.info(f"Found image URL: {image_url}")
        # make sure the text around the image is not very large, crop it around the image
        start_pos = match.start()
        end_pos = match.end()
        # Calculate context bounds
        context_start = max(0, start_pos - 4000)
        context_end = min(len(full_text), end_pos + 4000)
        # Create limited context copy
        limited_context = markdown.copy()
        limited_context.page_content = full_text[context_start:context_end]
        return self.image_processor.prepare_for_rag(
            image_url,
            limited_context,
            knowledgebase_id
        )

    def split_markdown_table(self, table_text: str, max_tokens: int = 300, max_rows: int = 10) -> List[str]:
        """
        Split a markdown table into chunks based on token length and max rows.

        Args:
            table_text: String containing markdown table
            max_tokens: Maximum tokens per chunk
            max_rows: Maximum rows per chunk as safety limit

        Returns:
            List of table chunks as strings
        """
        lines = table_text.strip().split('\n')
        if len(lines) < 3:
            return [table_text]

        header = lines[0]
        separator = lines[1] if '|' in lines[1] else None
        data_rows = lines[2:] if separator else lines[1:]

        # Calculate header tokens
        header_tokens = self.openai_client.tiktoken_len(
            f"{header}\n{separator}\n" if separator else f"{header}\n"
        )

        chunks = []
        current_chunk_rows = []
        current_tokens = header_tokens

        for row in data_rows:
            row_tokens = self.openai_client.tiktoken_len(row + "\n")

            # Check if adding this row would exceed limits
            if (current_tokens + row_tokens > max_tokens or
                len(current_chunk_rows) >= max_rows) and current_chunk_rows:
                # Create chunk with current rows
                if separator:
                    chunk = f"{header}\n{separator}\n" + "\n".join(current_chunk_rows)
                else:
                    chunk = f"{header}\n" + "\n".join(current_chunk_rows)
                chunks.append(chunk)

                # Reset for next chunk
                current_chunk_rows = []
                current_tokens = header_tokens

            current_chunk_rows.append(row)
            current_tokens += row_tokens

        # Add remaining rows as final chunk
        if current_chunk_rows:
            if separator:
                chunk = f"{header}\n{separator}\n" + "\n".join(current_chunk_rows)
            else:
                chunk = f"{header}\n" + "\n".join(current_chunk_rows)
            chunks.append(chunk)

        return chunks

    def _split_markdown_by_header(self, markdowns: List[Document]) -> List[Document]:
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]

        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on,
            strip_headers=True # header is in metadata
        )

        processed_texts = []

        for markdown in markdowns:
            chunks = markdown_splitter.split_text(markdown.page_content)
            for chunk in chunks:
                # Update chunk's metadata with original document's metadata
                chunk.metadata.update(markdown.metadata)
                processed_texts.append(chunk)

        return processed_texts

    def _split_documents_to_size(self, documents: List[Document], max_chunk_size: int = 400, chunk_overlap: int = 20) -> List[Document]:
        """Process texts using full content for short texts and chunking for longer ones

        Args:
            documents: List of text strings to process
            max_chunk_size: Texts longer than this many tokens will be chunked
            chunk_overlap: Number of tokens to overlap between chunks

        Returns:
            List of processed text chunks
        """
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            model_name="gpt-4o",
            chunk_size=max_chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", " "]
        )

        return text_splitter.split_documents(documents)

    def _merge_small_chunks(self, docs: List[Document], max_tokens: int = 400) -> List[Document]:
        if len(docs) <= 1:
            return docs

        result = []
        i = 0

        while i < len(docs):
            current_doc = docs[i]
            current_tokens = self.openai_client.tiktoken_len(current_doc.page_content)

            if i + 1 < len(docs):
                next_doc = docs[i + 1]
                next_tokens = self.openai_client.tiktoken_len(next_doc.page_content)
                combined_tokens = current_tokens + next_tokens

                # Check if pages match or if either doc doesn't have page info
                pages_match = (
                        'page' not in current_doc.metadata or
                        'page' not in next_doc.metadata or
                        current_doc.metadata['page'] == next_doc.metadata['page']
                )

                if combined_tokens <= max_tokens and pages_match:
                    merged_content = current_doc.page_content + "\n\n" + next_doc.page_content
                    merged_metadata = {**current_doc.metadata, **next_doc.metadata}

                    result.append(Document(
                        page_content=merged_content,
                        metadata=merged_metadata
                    ))
                    i += 2
                    continue

            result.append(current_doc)
            i += 1

        return result

    def _guess_document_name(self, context: Document):
        self.logger.info("trying to guess the document name")
        context_text = context.page_content[:4000] if len(context.page_content) > 4000 else context.page_content

        info = self.openai_client.call_openai(
            messages=[
                {
                    "role": "system",
                    "content": """Sie sind ein Dokumententitel-Erkennungssystem. Befolgen Sie diese Regeln strikt:

        1. Priorität der Titelerkennung:
           - Zuerst nach einem expliziten Titel im Dokumentenkopf/Anfang suchen
           - Dann nach Titelmustern in der URL suchen (nach dem letzten Schrägstrich, vor der Dateierweiterung)
           - Schließlich nach markanten Überschriften im ersten Absatz suchen
           - Den vorherigen Titel berücksichtigen, wenn er spezifisch und relevant ist

        2. Umgang mit vorherigen Titeln:
           - Wenn der vorherige Titel spezifisch ist und zum Dokumentinhalt passt, diesen verwenden
           - Generische vorherige Titel wie z.B. "Vorlage", "Startseite", "Index", "Willkommen", "Unbenannt", "Powerpoint" usw. ignorieren
           - Vorherigen Titel nicht verwenden, wenn er dem Dokumentinhalt widerspricht

        3. Titelformat-Anforderungen:
           - Muss zwischen 10 und 250 Zeichen lang sein
           - Jegliche nachfolgende Satzzeichen entfernen
           - Generische Begriffe ausschließen, wenn sie alleinstehend sind
           - Die Sprache des Dokuments für den Titel verwenden

        4. Rückgabewerte:
           - Den wahrscheinlichsten Titel als 'most_likely_title' zurückgeben
           - Wenn kein gültiger Titel gefunden wurde, 'none' zurückgeben
           - Niemals Titel ohne bezug erfinden

        5. Ungültige Titel-Indikatoren:
           - URLs mit nur IDs/Zahlen
           - Generische Dateinamen (z.B. index.html, default.aspx)
           - Navigationselemente oder Menüpunkte"""
                },
                {
                    "type": "text",
                    "role": "user",
                    "content": f"Hier die erste Seite des Dokuments: {context_text}\n\n"
                               + "Url: " + context.metadata['source'].url + "\n\n"
                               + (f"\nBisheriger Titel: {context.metadata['source'].title}" if context.metadata['source'].title is not None else "None") + "\n\n",
                }
            ],
            model=GPTModel.GPT4O_MINI,

            response_type=TitleResult,
            max_retries=10
        )

        if info.most_likely_title is not None and info.most_likely_title != "" and info.most_likely_title != "none":
            self.logger.info("detected title: " + info.most_likely_title)
            context.metadata['source'].title = info.most_likely_title

        pass


