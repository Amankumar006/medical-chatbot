# Medical Chatbot

This project is a browser-based medical assistant built with HTML/CSS/JS frontend and a Node.js API backend.

## What changed
1. **Backend API layer**: model calls moved to Express routes.
2. **Validation + rate limiting**: schema-style payload guards and in-memory request throttling.
3. **Hybrid retrieval**: lexical keyword + semantic token expansion scoring.
4. **Single orchestration path**: frontend now calls only `/api/chat` for chat flow.
5. **Tests**: smoke tests for triage, retrieval, validation, and rate limiting.

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

## Branch conflict checks
If you suspect unresolved merge conflicts in your branch, run:

```bash
bash scripts/check-conflicts.sh
```

Or from `server/`:

```bash
npm run check:conflicts
```
