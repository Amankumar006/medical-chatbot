const express = require('express');
const cors = require('cors');
const { scoreMessageRisk } = require('./services/triage');
const { retrieveContext } = require('./services/retrieval');
const { generateCompletion } = require('./services/groq');
const { createRateLimiter } = require('./middleware/rate-limit');
const { validateMessagePayload, validateUploadPayload } = require('./middleware/validation');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(createRateLimiter({ windowMs: 60_000, max: 40 }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/triage', validateMessagePayload, (req, res) => {
  const { message } = req.body;
  const triage = scoreMessageRisk(message);
  res.json(triage);
});

app.post('/api/retrieve', validateMessagePayload, (req, res) => {
  const { message } = req.body;
  const documents = retrieveContext(message);
  res.json({ documents });
});

app.post('/api/chat', validateMessagePayload, async (req, res) => {
  try {
    const { message } = req.body;

    // Step 1: triage
    const triage = scoreMessageRisk(message);
    if (triage.emergency) {
      return res.json({
        answer: '⚠️ This may be an emergency. Call emergency services now or go to the nearest ER immediately.',
        triage,
        citations: [],
        stage: 'triage'
      });
    }

    // Step 2: retrieval
    const documents = retrieveContext(message);
    const context = documents
      .map((d, index) => `${index + 1}. ${d.summary} (Source: ${d.source}, score: ${d.score.toFixed(2)})`)
      .join('\n');

    // Step 3: generation
    let answer;
    try {
      answer = await generateCompletion([
        {
          role: 'system',
          content: 'You are a cautious medical assistant. Do not diagnose. Give educational guidance, ask clarifying questions, and include urgent care triggers.'
        },
        {
          role: 'user',
          content: `User question: ${message}\n\nReference context:\n${context || 'No context found.'}`
        }
      ]);
    } catch (_error) {
      answer = context
        ? `I could not reach the AI provider. Based on trusted context: ${documents[0].summary}`
        : 'I could not reach the AI provider right now. Please try again shortly.';
    }

    return res.json({
      answer,
      triage,
      citations: documents.map((doc) => ({ id: doc.id, topic: doc.topic, source: doc.source, score: doc.score }))
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload/analyze', validateUploadPayload, async (req, res) => {
  const { content, fileName = 'file' } = req.body;

  try {
    const answer = await generateCompletion([
      {
        role: 'system',
        content: 'Summarize file content in a medically cautious way and suggest clinical follow-up when needed.'
      },
      {
        role: 'user',
        content: `Analyze this file (${fileName}):\n\n${content}`
      }
    ], { maxTokens: 1000 });

    return res.json({ answer });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
});

module.exports = app;
