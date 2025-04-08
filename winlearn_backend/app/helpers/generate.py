import os
import json
import openai
import logging
import asyncio
import random
import math
from dotenv import load_dotenv
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from azure.storage.blob import BlobServiceClient

# Load environment variables
load_dotenv()

# Azure AI Search Config
SEARCH_SERVICE = os.getenv("AZURE_SEARCH_SERVICE")
SEARCH_API_KEY = os.getenv("AZURE_SEARCH_API_KEY")
SEARCH_INDEX = os.getenv("AZURE_SEARCH_INDEX")

# Azure Blob Storage Config
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("CONTAINER_NAME")

# OpenAI Config
API_KEY = os.getenv("AZURE_OPENAI_KEY")
API_BASE = os.getenv("AZURE_OPENAI_ENDPOINT")
DEPLOYMENT_NAME = "gpt-4o"
API_VERSION = "2025-01-01-preview"

# Initialize clients
search_client = SearchClient(
    f"https://{SEARCH_SERVICE}.search.windows.net",
    SEARCH_INDEX,
    AzureKeyCredential(SEARCH_API_KEY)
)
blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(CONTAINER_NAME)

client = openai.AzureOpenAI(
    api_key=API_KEY,
    azure_endpoint=API_BASE,
    api_version=API_VERSION
)

async def fetch_transcript_chunks(course_name):
    """Fetches all transcript chunks from Azure Blob Storage for a given course."""
    try:
        blobs = sorted(
            container_client.list_blobs(name_starts_with=f"{course_name}-part"),
            key=lambda x: x.name
        )

        if not blobs:
            logging.warning(f"No transcripts found for {course_name}")
            return []

        transcript_chunks = []
        for blob in blobs:
            blob_client = container_client.get_blob_client(blob=blob.name)
            transcript_text = await asyncio.to_thread(blob_client.download_blob().readall)
            transcript_chunks.append(transcript_text.decode("utf-8"))

        return transcript_chunks  # Return as a list instead of a single string

    except Exception as e:
        logging.error(f"Error fetching transcript chunks: {str(e)}")
        return []


async def generate_mcqs(content, num_questions):
    """Generates a specific number of MCQs based on the provided transcript part."""
    prompt = f"""
    You are an expert in instructional design. Generate exactly {num_questions} high-quality multiple-choice-questions.
    
    - Avoid generic or simplistic questions.
    - Each question must test important concepts, facts, or key takeaways from the content.
    - Each question must have **one correct answer** and **three incorrect but plausible distractors**.

    Return only valid JSON in this format:
    [
        {{
            "question": "What is the main function of X?",
            "options": [
                {{"text": "Correct Answer", "is_true": true}},
                {{"text": "Wrong Answer 1", "is_true": false}},
                {{"text": "Wrong Answer 2", "is_true": false}},
                {{"text": "Wrong Answer 3", "is_true": false}}
            ]
        }}
    ]

    No explanations, no markdown, and no extra text before or after.
    Content:
    {content}
    """

    try:
        response = await asyncio.to_thread(client.chat.completions.create,
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON. No explanations, no markdown."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=4000,
            top_p=0.9
        )

        raw_response = response.choices[0].message.content.strip()
        cleaned_response = raw_response.replace("\n", "").replace("\r", "").strip()
        mcqs = json.loads(cleaned_response)
        return mcqs[:num_questions]  # Limit to the requested number of questions

    except json.JSONDecodeError:
        logging.error("Invalid JSON received from OpenAI.")
        return []
    except Exception as e:
        logging.error(f"Error generating MCQs: {e}")
        return []

async def generate_questions(course_name):
    """Runs the full RAG pipeline asynchronously to retrieve content and generate MCQs."""
    try:
        logging.info(f"Fetching transcript for course: {course_name}")
        transcript_chunks = await fetch_transcript_chunks(course_name)

        # If still no content found, return an error
        if not transcript_chunks:
            logging.error("No relevant content found.")
            return {"status_code": 404, "message": "No relevant content found."}

        num_parts = len(transcript_chunks)
        num_questions_per_part = max(1, math.ceil(20 / num_parts))  # Ensures at least 1 question per part

        logging.info(f"Splitting content into {num_parts} parts, generating {num_questions_per_part} questions per part.")

        all_mcqs = []
        for chunk in transcript_chunks:
            mcqs = await generate_mcqs(chunk, num_questions_per_part)
            all_mcqs.extend(mcqs)

        # Shuffle the final set of questions for randomness
        random.shuffle(all_mcqs)

        logging.info(f"MCQs successfully generated! Total: {len(all_mcqs)}")
        return {"status_code": 200, "Questions": all_mcqs[:20]}  # Limit to 20 questions

    except Exception as e:
        logging.error(f"Error in generate_questions: {str(e)}")
        return {"status_code": 500, "message": "An error occurred while generating questions."}