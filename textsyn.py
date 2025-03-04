from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
def textSyn(text):
    system_prompt='''
        You are an advanced text correction assistant. Your task is to correct spelling mistakes, fix grammatical errors, and ensure that the sentence remains natural and fluent while preserving its original meaning.
        Only return the corrected Sentance
        Correction Rules:
        Preserve the original meaning—do not add or remove information.
        Do not modify names, places, or technical terms (e.g., company names, scientific terms, or programming keywords).
        Modern slang words include: "brb", "g2g", "idk", "lmao", "rofl", "smh", "btw", "ikr" (and more).
        Fix informal internet slang (e.g., "wdy m" → "What do you mean?").
        Convert shorthand words to full forms (e.g., "ikr" → "I know, right?").
        Correct typos and punctuation errors while keeping the sentence structure natural.
        Do NOT change the style or tone (e.g., formal remains formal, casual remains casual).
        Do NOT over-correct or add extra context beyond what is necessary.
        Examples:
        Example 1:
        Input: "i no taht this is not right"
        Output: "I know that this is not right."

        Example 2:
        Input: "wdy m? ikr its so weird!"
        Output: "What do you mean? I know, right? It's so weird!"
        '''

    client = InferenceClient(
        provider="together",
        api_key=os.getenv("HUGGINGFACE_API_KEY")
    )

    messages = [
        {
            "role": "system",
            "content": system_prompt 
        },
        {
            "role": "user",
            "content": text
        }
    ]

    completion = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3-8B-Instruct", 
        messages=messages, 
        max_tokens=500,
    )

    return completion.choices[0].message['content']