from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
import os
import json
import requests

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Load the review data
data = json.load(open("reviews.json"))

processed_data = []

# Set the correct Gemini API endpoint
gemini_endpoint = "https://ai.google.dev/api/generate-content#text_gen_text_only_prompt-PYTHON"  # Replace with the actual correct endpoint
gemini_api_key = os.getenv("GEMINI_API_KEY")
headers = {
    "Authorization": f"Bearer {gemini_api_key}",
    "Content-Type": "application/json"
}

# Create embeddings for each review using Gemini API
for review in data["reviews"]:
    response = requests.post(
        gemini_endpoint,
        headers=headers,
        json={"input": review['review']}
    )
    if response.status_code == 200:
        try:
            embedding = response.json().get('embedding')
            if embedding:
                processed_data.append(
                    {
                        "values": embedding,
                        "id": review["professor"],
                        "metadata": {
                            "review": review["review"],
                            "subject": review["subject"],
                            "stars": review["stars"],
                        }
                    }
                )
        except json.JSONDecodeError:
            print("Received non-JSON response or empty response.")
            print(f"Response text: {response.text}")
    else:
        print(f"Failed to get embedding for review: {review['review']} - Status Code: {response.status_code}")
        print(f"Response body: {response.text}")



# Insert the embeddings into the Pinecone index
index = pc.Index("rag")
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
