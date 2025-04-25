from enum import Enum
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class RAGType(Enum):
    SIMPLE = "simple"
    VIPR = "VIPR"

    @classmethod
    def choices(cls):
        return [(member.value, member.name) for member in cls]

    @classmethod
    def from_string(cls, value: str):
        """Convert string value back to enum member"""
        try:
            return cls(value)
        except ValueError:
            return cls.SIMPLE  # Default fallback


class QSourceType(str, Enum):  # Note: inheriting from str makes the enum JSON serializable
    WEBSITE = "website"
    PDF = "pdf"
    FAQ = "faq"
    MARKDOWN = "markdown"

    @staticmethod
    def from_str(label):
        if label in ('website', 'WEBSITE', 'Website'):
            return QSourceType.WEBSITE
        elif label in ('pdf', 'PDF'):
            return QSourceType.PDF
        elif label in ('faq', 'Faq', 'FAQ'):
            return QSourceType.FAQ
        else:
            raise NotImplementedError


class QSourceOriginType(str, Enum):
    UNKNOWN = "unknown"
    CRAWLER = "crawler"
    GRAPHQL = "graphql"
    FAQ_CATEGORY = "faq_category"
    WEBDAV = "webdav"  # Neuer Typ für WebDAV-Quellen

class QSourceOrigin(BaseModel):
    type: QSourceOriginType
    # int for now, we can change it to string when needed.
    id: int

    def serialize(self) -> str:
        return f"{self.type.value}:{self.id}"

    @classmethod
    def deserialize(cls, value: str) -> "QSourceOrigin":
        origin_type, ref_id = value.split(":")
        return cls(
            type=QSourceOriginType(origin_type),
            id=int(ref_id)
        )

    @classmethod
    def default(cls) -> "QSourceOrigin":
        return cls(type=QSourceOriginType.UNKNOWN, id=0)

class QDocType(str, Enum):
    TEXT = "text"
    TABLE = "table"
    IMAGE = "image"
    FAQ = "faq"


# information about the origin of the document
class QSource(BaseModel):
    reference_id: str
    url: str
    source_type: QSourceType
    source_origin: QSourceOrigin = QSourceOrigin.default()
    title: Optional[str] = None  # or title: str | None = None
    create_date: Optional[datetime] = None
    summary: Optional[str] = None
    metadata: Optional[dict] = None

class QDocument(BaseModel):
    reference_id: str
    text: str
    doc_type: QDocType
    source: QSource
    checksum: str
    embedding_text: str
    metadata: Optional[dict] = None
    image_content: Optional[str] = None

