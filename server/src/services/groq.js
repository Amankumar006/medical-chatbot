const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

async function generateCompletion(messages, options = {}) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Server GROQ_API_KEY is not configured');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: options.maxTokens || 900,
      temperature: options.temperature ?? 0.3
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GROQ error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

module.exports = { generateCompletion };
