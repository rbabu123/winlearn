from fastapi import APIRouter, HTTPException
import httpx
import asyncio

AZURE_EXTRACT_FUNCTION_URL = "https://ext-gen-func-app.azurewebsites.net/api/extractTextFunction?code=ZHvCqFaAY_rZdPGj9yVgbGSKd4_CAZQV2KZYaohpxPb2AzFuK7KW1w=="
AZURE_GENERATE_FUNCTION_URL = "https://ext-gen-func-app.azurewebsites.net/api/generateMcqFunction?code=ZHvCqFaAY_rZdPGj9yVgbGSKd4_CAZQV2KZYaohpxPb2AzFuK7KW1w=="

router = APIRouter()

async def extract_text(payload: dict, max_retries: int = 3, delay: int = 2):
    """Calls Azure Function to extract text with retry logic.
    
    Args:
        payload (dict): Data to be sent in the request.
        max_retries (int): Maximum number of retry attempts. Default is 3.
        delay (int): Delay (in seconds) between retries. Default is 2.

    Returns:
        dict: Status code and message.
    """
    async with httpx.AsyncClient() as client:
        for attempt in range(max_retries):
            try:
                response = await client.post(AZURE_EXTRACT_FUNCTION_URL, json=payload)
                
                if response.status_code == 200:
                    return {"status_code": 200, "message": "✅ Success: Azure Function executed successfully"}
                
                # Log failure and retry after delay
                await asyncio.sleep(delay)

            except httpx.RequestError:
                if attempt == max_retries - 1:  # Last attempt failed
                    raise HTTPException(status_code=500, detail="❌ Failed to reach Azure Function")
        
        return {"status_code": response.status_code, "message": f"⚠️ Failure: Received status code {response.status_code}"}


async def generate_mcq(payload: dict, max_retries: int = 3, delay: int = 2):
    """Calls Azure Function to generate MCQs with retry logic.

    Args:
        payload (dict): Data to be sent in the request.
        max_retries (int): Maximum number of retry attempts. Default is 3.
        delay (int): Delay (in seconds) between retries. Default is 2.

    Returns:
        dict: Status code and response data.
    """
    async with httpx.AsyncClient() as client:
        for attempt in range(max_retries):
            try:
                response = await client.post(AZURE_GENERATE_FUNCTION_URL, json=payload)
                
                if response.status_code == 200:
                    return {
                        "status_code": 200,
                        "message": "✅ Success: MCQs generated successfully",
                        "data": response.json()
                    }

                # Log failure and retry after delay
                await asyncio.sleep(delay)

            except httpx.RequestError:
                if attempt == max_retries - 1:  # Last attempt failed
                    raise HTTPException(status_code=500, detail="❌ Failed to reach Azure Function")
        
        return {
            "status_code": response.status_code,
            "message": f"⚠️ Failure: Received status code {response.status_code}"
        }
