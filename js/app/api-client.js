const API_BASE_URL = window.HEALTHAI_API_BASE_URL || 'http://localhost:3000';

async function post(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response.json();
}

export function chat(message) {
  return post('/api/chat', { message });
}

export function analyzeUpload(content, fileName) {
  return post('/api/upload/analyze', { content, fileName });
}

export function retrieve(message) {
  return post('/api/retrieve', { message });
}
