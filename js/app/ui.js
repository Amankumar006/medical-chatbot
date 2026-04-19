export function addMessageToChat(message, className = 'bot-message') {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${className}`;

  const content = document.createElement('span');
  content.textContent = message;
  messageDiv.appendChild(content);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

export function showTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.style.display = 'flex';
}

export function hideTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.style.display = 'none';
}

export function setCitations(citations = []) {
  const container = document.getElementById('citations');
  if (!container) return;

  if (!citations.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `<strong>Sources:</strong> ${citations.map((c) => `${c.topic} (${c.source})`).join(', ')}`;
}
