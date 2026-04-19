import { chat, triageMessage } from './api-client.js';
import { addMessageToChat, hideTypingIndicator, setCitations, showTypingIndicator } from './ui.js';

export async function handleSendMessage() {
  const input = document.getElementById('user-input');
  const message = input?.value?.trim();
  if (!message) return;

  addMessageToChat(message, 'user-message');
  input.value = '';
  showTypingIndicator();

  try {
    const triage = await triageMessage(message);
    if (triage.emergency) {
      addMessageToChat('⚠️ This appears urgent. Call emergency services immediately.', 'bot-message');
      setCitations([]);
      return;
    }

    const response = await chat(message);
    addMessageToChat(response.answer || 'No response available.', 'bot-message');
    setCitations(response.citations || []);
  } catch (error) {
    addMessageToChat(`Error: ${error.message}`, 'bot-message');
    setCitations([]);
  } finally {
    hideTypingIndicator();
  }
}
