from dotenv import load_dotenv

load_dotenv()
from pinecone import Pinecone
import os
import json
import google.generativeai as genai

# Load the review data
data = json.load(open("reviews.json"))

# Gemini API KEy
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# initialize empty array to hold data
processed_data = []

# Create embeddings for each review
for review in data["reviews"]:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=review["review"],
        task_type="retrieval_document",
        title="Embedding of single string",
    )
    embeddings = result["embedding"]
    processed_data.append(
        {
            "values": embeddings,
            "id": review["professor"],
            "metadata": {
                "review": review["review"],
                "subject": review["subject"],
                "stars": review["stars"],
            },
        }
    )

# Insert the embeddings into the Pinecone index
from pinecone import Pinecone

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index = pc.Index("rag2")
if processed_data:
    upsert_response = index.upsert(
        vectors=processed_data,
        namespace="ns1",
    )
    print(f"Upserted count: {upsert_response['upserted_count']}")
else:
    print("No valid embeddings were generated, so nothing to upsert.")

# Print index statistics
print(index.describe_index_stats())
