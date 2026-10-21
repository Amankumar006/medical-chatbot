/**
 * Main Application Entry Point
 * Manages tab switching, module loading, and event listeners for the offline-first vernacular companion.
 */
import { handleSendMessage } from './chat-controller.js';
import { addMessageToChat } from './ui.js';
import { renderPrepModule } from './prep-controller.js';
import { renderSummaryModule } from './summary-controller.js';
import { renderDirectoryModule } from './directory-controller.js';
import { speechService } from '../services/speech.js';

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const viewContainer = document.getElementById('main-view-container');
  const viewTitle = document.getElementById('view-title');
  const viewSubtitle = document.getElementById('view-subtitle');

  // Initial Chat View HTML markup saved
  const chatViewHTML = viewContainer.innerHTML;

  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const target = link.getAttribute('data-target');

      if (target === 'chat') {
        viewTitle.textContent = 'AI Health Assistant';
        viewSubtitle.textContent = 'Offline-first vernacular consultation prep & navigation companion';
        viewContainer.innerHTML = chatViewHTML;
        initChatListeners();
      } else if (target === 'prep') {
        viewTitle.textContent = 'Pre-Visit Consultation Prep';
        viewSubtitle.textContent = 'Build symptom timelines & question checklists for your doctor visit';
        await renderPrepModule(viewContainer);
      } else if (target === 'summary') {
        viewTitle.textContent = 'Post-Visit Consultation Summary';
        viewSubtitle.textContent = 'Record advice, diagnoses, and follow-ups securely on your device';
        await renderSummaryModule(viewContainer);
      } else if (target === 'directory') {
        viewTitle.textContent = 'Local Public Care Directory';
        viewSubtitle.textContent = 'Find public health facilities, PHCs, and eSanjeevani digital health hubs';
        await renderDirectoryModule(viewContainer);
      }
    });
  });

  // Initialize chat listeners on startup
  initChatListeners();
  addMessageToChat('Namaste! I am your offline care navigation and consultation prep companion. How can I help you prepare for your visit today?', 'assistant-message');

  // Voice dictate button in header
  const voiceBtn = document.getElementById('voice-dictate-btn');
  voiceBtn?.addEventListener('click', () => {
    const userInput = document.getElementById('user-input');
    if (!userInput) return;
    speechService.startListening('hi-IN', (transcript, isFinal) => {
      userInput.value = transcript;
    }, (err) => {
      alert('Voice recognition error: ' + err);
    });
    alert('Listening... Speak into your microphone.');
  });
});

function initChatListeners() {
  const sendButton = document.getElementById('send-button');
  const userInput = document.getElementById('user-input');

  sendButton?.addEventListener('click', handleSendMessage);
  userInput?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSendMessage();
  });
}
