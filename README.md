# Medical Chatbot

This project is a browser-based medical assistant built with HTML/CSS/JS frontend and a Node.js API backend.

## What changed (1 → 5)
1. **Backend API layer**: model calls moved to Express routes.
2. **Frontend modularization**: chat logic split into ES modules.
3. **Safety + triage**: server-side emergency risk checks before answering.
4. **Retrieval + citations**: KB-backed context and source list with responses.
5. **Tests**: smoke tests for triage and retrieval services.

## Run locally
### Server
```bash
cd server
npm install
GROQ_API_KEY=your_key_here npm start
```

### Frontend
Serve project root with any static file server and open `index.html`.
Frontend expects API at `http://localhost:3000` by default.

## Test
```bash
cd server
npm test
```
