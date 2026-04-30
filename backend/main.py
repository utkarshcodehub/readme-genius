from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
from typing import Optional, List

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ReadmeRequest(BaseModel):
    project_name: str
    description: str
    tech_stack: List[str]
    features: Optional[str] = ""
    code_snippets: Optional[str] = ""


SYSTEM_PROMPT = (
    "You are a senior developer who writes exceptional, production-quality README files.\n\n"
    "Generate a complete README.md with these exact sections in order:\n"
    "1. Project title with a relevant emoji\n"
    "2. A one-line tagline in italics\n"
    "3. Shields.io badges for each technology in the tech stack\n"
    "4. ## Overview - 2-3 paragraphs describing the project\n"
    "5. ## Features - bullet list\n"
    "6. ## Tech Stack - table with Category | Technology columns\n"
    "7. ## Architecture - description + mermaid flowchart diagram\n"
    "8. ## Getting Started - Prerequisites then Installation with code blocks\n"
    "9. ## Usage - how to use with examples\n"
    "10. ## Contributing\n"
    "11. ## License - MIT\n\n"
    "Rules:\n"
    "- Use real shields.io badge markdown URLs based on the actual tech\n"
    "- Mermaid diagram must reflect the described architecture\n"
    "- Output ONLY raw markdown. No preamble, no explanation."
)


def stream_readme(req: ReadmeRequest):
    tech = ", ".join(req.tech_stack) if req.tech_stack else "Not specified"
    msg = (
        f"Project Name: {req.project_name}\n"
        f"Description: {req.description}\n"
        f"Tech Stack: {tech}\n"
        f"Key Features: {req.features or 'Not specified'}\n"
        f"Code Sample:\n{req.code_snippets or 'Not provided'}\n\n"
        "Write a complete production-quality README.md."
    )

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": msg},
        ],
        stream=True,
        max_tokens=4096,
        temperature=0.7,
    )
    for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            yield text


@app.post("/generate-readme")
def generate_readme(req: ReadmeRequest):
    return StreamingResponse(stream_readme(req), media_type="text/plain")


@app.get("/health")
def health():
    return {"status": "ok"}
