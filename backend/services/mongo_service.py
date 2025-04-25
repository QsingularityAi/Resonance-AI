from typing import Optional, Dict, List, Any

from pymongo import MongoClient
from django.conf import settings


class MongoService:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URL)
        self.db_name = settings.MONGODB_URL.split('/')[-1]
        self.db = self.client[self.db_name]
        self.collection_basename = settings.CRAWLER_RESULT_COLLECTION_NAME

    def get_collection_name(self, knowledgebase_id: int) -> str:
        if knowledgebase_id == 0:
            return "BenchmarkDocuments"
        return f"{self.collection_basename}_{knowledgebase_id}"

    def insert_rag_data(self, knowledgebase_id: int, data):
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.insert_one(data)

    def get_rag_data(self, knowledgebase_id: int, query: Optional[Dict] = None) -> List[Dict[str, Any]]:
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return list(collection.find(query or {}))

    def get_one_rag_data(self, knowledgebase_id: int, query: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.find_one(query or {})

    def get_data_as_cursor(self, knowledgebase_id: int, query=None):
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.find(query or {})

    def update_rag_data(self, knowledgebase_id: int, query, update_data):
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.update_one(query, {'$set': update_data})

    def delete_rag_data(self, knowledgebase_id: int, query):
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.delete_one(query)

    def delete_many_rag_data(self, knowledgebase_id: int, query):
        collection = self.db[self.get_collection_name(knowledgebase_id)]
        return collection.delete_many(query)

    def close(self):
        if self.client:
            self.client.close()
