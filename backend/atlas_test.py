from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

uri = os.getenv("MONGODB_URI")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=10000)
    print(client.admin.command("ping"))
    print("✅ MongoDB Connected")
except Exception as e:
    print(e)