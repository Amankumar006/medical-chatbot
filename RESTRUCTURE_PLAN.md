# Medical Chatbot Restructure Plan (HTML/CSS/JS Only)

## 1) Current Application Review

Based on the current codebase structure and implementation, here are the main findings:

### Strengths
- Multi-page UI already exists for core patient workflows (chat, appointments, medications, doctors).
- Basic modularity is started in `js/` (API client, state manager, config, security).
- File upload capability and drag/drop behavior are already partially implemented.

### Gaps and Risks
- **Security issue (critical):** API key is hardcoded in client-side JavaScript (`script.js`), exposing credentials publicly.
- **Architecture drift:** mixture of inline/global scripts and ES module-style files that are not consistently wired.
- **HTML structure issue:** malformed markup in chat container can break rendering and DOM querying.
- **No clear separation of concerns:** UI, data fetching, business logic, and model prompts are mixed in one script.
- **No robust safety layer for medical use:** no triage, red-flag detection, confidence scoring, or strict fallback routing.
- **No proper model orchestration:** single direct model call; no retrieval, re-ranking, or citation discipline.
- **No test harness:** no linting, unit tests, or smoke tests.
- **README is broken:** unresolved merge conflict markers make onboarding unreliable.

---

## 2) Target Architecture (Still HTML/CSS/JS)

> Constraint respected: use only HTML, CSS, and JavaScript.

### Frontend (Vanilla JS + ES Modules)
- `index.html` + feature pages remain, but all logic moved to modular JS.
- Layered client architecture:
  - `ui/` (rendering, components, forms)
  - `features/chat/` (chat controller, message formatting)
  - `features/upload/` (file parsing/validation)
  - `services/` (API calls, auth/session, telemetry)
  - `store/` (single state container)
  - `utils/` (sanitization, date/time, validators)

### Backend (Node.js + Express, JavaScript only)
- New `server/` folder (JavaScript runtime only).
- API key and secrets stored server-side only (`.env`), never shipped to browser.
- Endpoints:
  - `POST /api/chat` (main conversation pipeline)
  - `POST /api/triage` (risk score + emergency intent)
  - `POST /api/retrieve` (knowledge retrieval)
  - `POST /api/upload/analyze` (document/image analysis)

### Data & Knowledge
- JSON-based curated medical knowledge packs (versioned in repo).
- Optional vector store service in JS stack (e.g., Qdrant API / Weaviate API / local JS ANN index).
- Citation metadata attached to each retrieved chunk.

---

## 3) Improved ML/AI Capability Roadmap (JS-compatible)

## A) Model Pipeline (Orchestration)
1. **Intent classification** (symptom question, medication query, appointment/admin, urgent concern).
2. **Risk triage classifier** (red flags like chest pain, stroke signs, suicidal ideation).
3. **Query rewrite** for retrieval quality.
4. **Hybrid retrieval** (keyword BM25-like + vector embeddings).
5. **Cross-encoder re-ranking** (or lightweight reranker via API).
6. **Response generation** with strict medical safety system prompt.
7. **Groundedness checker** (ensure response aligns with retrieved evidence).
8. **Confidence score + fallback**:
   - high confidence => answer with citations
   - medium => answer + caution
   - low => ask clarification or escalate to clinician

## B) Suggested Algorithms/Techniques (JS ecosystem)
- **Embeddings + semantic search:** `transformers.js` or external embedding API.
- **Approximate nearest neighbor:** HNSW/IVF-backed vector DB (access through JS SDK/HTTP).
- **Classifier options:**
  - Logistic regression / small neural classifier in TensorFlow.js for intents.
  - Rule+model hybrid for triage safety to guarantee recall on emergencies.
- **RAG strategy:** chunking + metadata filters (age group, condition, source type, recency).
- **Conversation memory:** short-term (session) + long-term summary memory, both in JS-managed store.

## C) New Capabilities
- Symptom collection wizard with structured follow-up questions.
- Medication interaction checks with caution levels.
- Personalized reminders (appointments, medication schedules).
- Multi-language response option.
- “When to seek urgent care” decision cards.
- Source-backed responses with “Why this answer” explanation block.

---

## 4) Proposed Folder Restructure

```text
medical-chatbot/
  index.html
  pages/
    appointments.html
    medications.html
    doctors.html
  assets/
    css/
      base.css
      layout.css
      chat.css
    js/
      app.js
      router.js
      store/
        index.js
      ui/
        components/
        views/
      features/
        chat/
          chat-controller.js
          prompt-builder.js
          answer-renderer.js
        triage/
          triage-engine.js
        retrieval/
          retriever.js
          reranker.js
        uploads/
          upload-controller.js
      services/
        api-client.js
        auth.js
        telemetry.js
      utils/
        sanitize.js
        validators.js
        logger.js
  server/
    src/
      index.js
      routes/
      controllers/
      services/
      safety/
      retrieval/
      models/
    package.json
  data/
    medical_kb/
      *.json
  tests/
    unit/
    e2e/
```

---

## 5) Implementation Plan (Phased)

### Phase 0 — Stabilize
- Remove secrets from frontend.
- Fix broken HTML structure and README.
- Add `.env.example` parity for server values.
- Add lint + formatter + baseline test command.

### Phase 1 — Frontend Modularization
- Convert all global scripts to ES modules.
- Introduce centralized state store.
- Build reusable UI components (message bubble, suggestion chips, alert cards).

### Phase 2 — Backend API Layer
- Add Express server and move all model calls server-side.
- Add structured error handling and rate limiting.
- Add request/response schema validation.

### Phase 3 — Safety + Triage
- Implement emergency red-flag detector.
- Add “safe completion policy” with mandatory caution templates.
- Add escalation path and emergency guidance UI.

### Phase 4 — Retrieval-Augmented Answers
- Build ingestion pipeline for trusted health content.
- Implement retrieval + reranking + citations in final response.
- Add answer confidence and uncertainty handling.

### Phase 5 — Advanced Features
- Personal profile context (allergies, meds, chronic conditions).
- Medication interaction assistant.
- Follow-up plan generation and reminders.

### Phase 6 — Quality & Compliance-Ready Engineering
- Unit/integration/e2e tests.
- Monitoring (latency, hallucination indicators, unsafe response rate).
- Accessibility (keyboard navigation, contrast, ARIA).
- Privacy controls and user data retention options.

---

## 6) Success Metrics
- < 2.5s average response latency (non-file query).
- > 90% retrieval groundedness on evaluation set.
- 99%+ recall for high-risk triage intents.
- Reduced unsafe responses and improved user satisfaction.

---

## 7) Immediate Next Actions (Recommended)
1. Create `server/` and move all external AI calls there.
2. Replace current chat logic with module-based chat controller.
3. Add triage guardrail before every generated response.
4. Add retrieval + citations before answer generation.
5. Add smoke tests for chat, upload, and emergency intent handling.

