from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests, uuid, json
import requests, uuid, json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()


app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain for security (e.g., "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

def translation(text, lang):
    key = os.getenv("Azure_Key")
    endpoint = "https://api.cognitive.microsofttranslator.com/"
    location = "westus2"

    path = '/translate'
    constructed_url = endpoint + path

    params = {
        'api-version': '3.0',
        'to': ['fr' if lang == "English" else 'en'],  # Translate English -> French, French -> English
    }

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    body = [{'text': text}]
    response = requests.post(constructed_url, params=params, headers=headers, json=body)

    if response.status_code == 200:
        return response.json()[0]['translations'][0]['text']
    else:
        return f"Error: {response.status_code}"

@app.post("/translate")
async def translate_text(data: dict):
    text = data.get("text", "")
    lang = data.get("lang", "English")
    translated_text = translation(text, lang)
    return {"translated_text": translated_text}
