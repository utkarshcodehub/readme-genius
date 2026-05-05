# GitHub README Genius

> AI-powered README generator that analyzes your GitHub repository and produces professional, structured documentation in seconds.

🔗 **Live Demo:** https://readme-genius-xfix.vercel.app/
🗓️ **Built:** Day 8 of 21-Day Build Challenge

---

## Overview

GitHub README Genius takes a GitHub repository URL as input, fetches the repository metadata, file structure, and code context via the GitHub API, and passes it all to an LLM to generate a comprehensive, well-structured README.md — tailored to the actual contents of the repo, not a generic template.

The problem it solves: most developers either skip writing READMEs or produce minimal ones. This tool does the heavy lifting by reading the actual repo and producing documentation that reflects what the project actually does.

---

## Features

- **Repo-aware generation** — reads file tree, language breakdown, description, and top-level files before generating
- **Structured output** — produces README with Overview, Features, Tech Stack, Setup, Usage, and API sections where applicable
- **One-click copy** — generated markdown copyable instantly
- **Live preview toggle** — switch between raw markdown and rendered preview
- **Terminal-aesthetic UI** — dark green on black, monospace typography, built for developers

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Groq API — Llama 3.3 70B |
| Data | GitHub REST API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Architecture

```
User inputs GitHub URL
        ↓
Frontend → POST /generate (FastAPI)
        ↓
GitHub API → fetch repo metadata, file tree, top files
        ↓
Groq LLM → generate structured README
        ↓
Return markdown → Frontend renders preview
```

---

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add GROQ_API_KEY and GITHUB_TOKEN to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_personal_access_token
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```

---

## API

### `POST /generate`

**Request:**
```json
{
  "repo_url": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "readme": "# Project Name\n\n..."
}
```

---

## Project Structure

```
github-readme-genius/
├── backend/
│   ├── main.py
│   ├── services/
│   │   ├── github.py       # GitHub API integration
│   │   └── ai.py           # Groq prompt + generation
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── RepoInput.jsx
            └── ReadmePreview.jsx
```

---

