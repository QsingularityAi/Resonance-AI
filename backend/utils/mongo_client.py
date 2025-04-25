from pymongo import MongoClient
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor
from threading import Lock



class MongoConnectionPool:
    def __init__(self, max_connections=50):
        self.max_connections = max_connections
        self.pool = ThreadPoolExecutor(max_workers=max_connections)

        self.connections = []
        self.lock = Lock()

    def get_connection(self):
        with self.lock:
            if len(self.connections) < self.max_connections:
                new_connection = MongoClient(settings.MONGODB_URL)
                self.connections.append(new_connection)
                return new_connection
            return None  # No available connections

    def release_connection(self, connection):
        with self.lock:
            if connection in self.connections:
                self.connections.remove(connection)
                connection.close()

    def close_all(self):
        with self.lock:
            for conn in self.connections:
                conn.close()
            self.connections.clear()