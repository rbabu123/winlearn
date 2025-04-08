import os
import logging
import json
import re
import requests
import pdfplumber
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
import urllib.parse
from azure.storage.blob import BlobServiceClient
from pytube import Playlist
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import asyncio
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Load environment variables
load_dotenv()

AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("CONTAINER_NAME")
MAX_CHUNK_SIZE = 5000  # Define chunk size for large transcripts

# Initialize Blob Service Client
blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(CONTAINER_NAME)


def upload_to_blob(file_name, content):
    """Uploads extracted text to Azure Blob Storage."""
    blob_client = container_client.get_blob_client(blob=file_name)
    blob_client.upload_blob(content, overwrite=True)
    logging.info(f"Uploaded {file_name} to Blob Storage.")


def chunk_text(text, max_size=MAX_CHUNK_SIZE):
    """Splits text into chunks to handle large transcripts efficiently."""
    words = text.split()
    chunks, current_chunk = [], []

    for word in words:
        if sum(len(w) for w in current_chunk) + len(word) > max_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
        current_chunk.append(word)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def extract_text_from_pdf(pdf_url):
    """Extracts text from a PDF file."""
    try:
        pdf_url = urllib.parse.quote(pdf_url, safe=':/')
        response = requests.get(pdf_url, stream=True)
        pdf_content = response.content

        with open("temp.pdf", "wb") as f:
            f.write(pdf_content)

        text = []
        with pdfplumber.open("temp.pdf") as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)

        return "\n".join(text).strip()

    except Exception as e:
        logging.error(f"Failed to extract PDF: {str(e)}")
        return ""


def extract_text_from_webpage(url):
    """Extracts text from a webpage, handling MS Learn pages with Selenium."""
    if "learn.microsoft.com" in url:
        return extract_ms_learn_content(url)

    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        return "\n".join([p.get_text() for p in paragraphs])
    except Exception as e:
        logging.error(f"Failed to extract webpage content: {str(e)}")
        return ""


def extract_ms_learn_content(url):
    """Extracts text from MS Learn training modules using Selenium."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)

    # Extract module links
    base_url = "https://learn.microsoft.com/en-us/training/modules/"
    links = driver.find_elements(By.TAG_NAME, "a")
    module_links = [link.get_attribute("href") for link in links if link.get_attribute("href") and link.get_attribute("href").startswith(base_url)]

    all_text = ""

    for link in module_links:
        try:
            driver.get(link)
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            paragraphs = soup.find_all('p')
            all_text += "\n".join([p.get_text() for p in paragraphs]) + "\n\n"
        except Exception as e:
            logging.error(f"Failed to extract content from {link}: {str(e)}")

    driver.quit()
    return all_text.strip()


def extract_video_id(url):
    """Extracts the video ID from a YouTube URL."""
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", url)
    return match.group(1) if match else None


def extract_youtube_transcript(video_url):
    """Extracts transcript from a YouTube video."""
    try:
        video_id = extract_video_id(video_url)
        if not video_id:
            raise ValueError("Invalid YouTube URL")

        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return "\n".join([entry['text'] for entry in transcript])

    except Exception as e:
        logging.error(f"Failed to extract YouTube transcript: {str(e)}")
        return ""


def extract_youtube_playlist(playlist_url):
    """Extracts transcripts from all videos in a YouTube playlist using parallel processing."""
    try:
        playlist = Playlist(playlist_url)
        transcripts = []
        
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(extract_youtube_transcript, playlist.video_urls))
        
        transcripts = [t for t in results if t]  # Remove empty results

        return "\n\n---\n\n".join(transcripts) if transcripts else ""

    except Exception as e:
        logging.error(f"Failed to extract YouTube playlist transcript: {str(e)}")
        return ""


async def extract_content(course_name, course_link):
    """Extracts content based on course link type and uploads it to Azure Blob Storage."""
    extracted_text = ""

    if "youtube.com/playlist" in course_link:
        extracted_text = extract_youtube_playlist(course_link)

    elif "youtube.com" in course_link or "youtu.be" in course_link:
        extracted_text = extract_youtube_transcript(course_link)

    elif course_link.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(course_link)

    else:
        extracted_text = extract_text_from_webpage(course_link)

    if extracted_text:
        chunks = chunk_text(extracted_text)
        for i, chunk in enumerate(chunks):
            await asyncio.to_thread(upload_to_blob, f"{course_name}-part{i+1}.txt", chunk)
        return {"status_code": 200, "message": "Extraction successful"}
    return {"status_code": 500, "message": "Failed to extract content"}



# if __name__ == "__main__":
#     # Example function call
#     extract_content("Sample-Course", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")

