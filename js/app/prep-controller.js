/**
 * Pre-Visit Preparation Controller
 * Manages symptom timeline and question checklist for primary care visits.
 */
import { db } from '../services/db.js';
import { speechService } from '../services/speech.js';

export async function renderPrepModule(container) {
  container.innerHTML = `
    <div class="prep-module">
      <div class="module-header">
        <h2><i class="fas fa-clipboard-list"></i> Pre-Visit Consultation Prep</h2>
        <p>Prepare your symptoms and questions for the doctor visit in your local language.</p>
      </div>

      <div class="prep-card">
        <h3>1. Symptom Timeline Builder</h3>
        <div class="form-group">
          <label>Main Symptom (e.g. Fever, Cough, Joint Pain):</label>
          <input type="text" id="symptom-main" placeholder="e.g. Continuous fever for 3 days">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Duration:</label>
            <input type="text" id="symptom-duration" placeholder="e.g. 3 days">
          </div>
          <div class="form-group">
            <label>Severity (1-10):</label>
            <select id="symptom-severity">
              <option value="Mild">Mild (1-3)</option>
              <option value="Moderate" selected>Moderate (4-6)</option>
              <option value="Severe">Severe (7-10)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Triggers / What makes it worse:</label>
          <input type="text" id="symptom-triggers" placeholder="e.g. Worse at night">
        </div>
      </div>

      <div class="prep-card">
        <h3>2. Doctor Question Checklist</h3>
        <p class="hint">Select questions to ask your doctor during consultation:</p>
        <div class="checklist-options">
          <label><input type="checkbox" name="q" value="What is the likely cause of my symptoms?"> What is the likely cause of my symptoms?</label>
          <label><input type="checkbox" name="q" value="What warning signs should I watch out for?"> What warning signs should I watch out for?</label>
          <label><input type="checkbox" name="q" value="Do I need any diagnostic tests or blood work?"> Do I need any diagnostic tests or blood work?</label>
          <label><input type="checkbox" name="q" value="When should I schedule a follow-up visit?"> When should I schedule a follow-up visit?</label>
        </div>
        <div class="form-group" style="margin-top: 12px;">
          <label>Add Custom Question:</label>
          <input type="text" id="custom-question" placeholder="Type or speak a question...">
        </div>
      </div>

      <div class="action-buttons">
        <button id="save-prep-btn" class="primary-btn"><i class="fas fa-save"></i> Save Preparation Notes (On-Device)</button>
        <button id="voice-read-prep" class="secondary-btn"><i class="fas fa-volume-up"></i> Read Checklist Aloud</button>
      </div>

      <div id="saved-prep-list" class="saved-list">
        <h3>Saved Preparation Notes</h3>
        <div id="prep-items-container">Loading saved notes...</div>
      </div>
    </div>
  `;

  await loadSavedPrep();

  document.getElementById('save-prep-btn').addEventListener('click', async () => {
    const main = document.getElementById('symptom-main').value;
    const duration = document.getElementById('symptom-duration').value;
    const severity = document.getElementById('symptom-severity').value;
    const triggers = document.getElementById('symptom-triggers').value;

    const checkboxes = document.querySelectorAll('input[name="q"]:checked');
    const questions = Array.from(checkboxes).map(cb => cb.value);
    const customQ = document.getElementById('custom-question').value;
    if (customQ) questions.push(customQ);

    if (!main) {
      alert('Please enter a main symptom.');
      return;
    }

    await db.add('pre_visit_prep', { main, duration, severity, triggers, questions });
    alert('Preparation saved successfully on your device!');
    await loadSavedPrep();
  });

  document.getElementById('voice-read-prep').addEventListener('click', () => {
    const main = document.getElementById('symptom-main').value || 'No symptom entered';
    speechService.speak(`Your symptom is ${main}. Be sure to ask your doctor your checklist questions.`);
  });
}

async function loadSavedPrep() {
  const container = document.getElementById('prep-items-container');
  if (!container) return;
  try {
    const items = await db.getAll('pre_visit_prep');
    if (items.length === 0) {
      container.innerHTML = '<p class="empty-text">No saved preparation notes yet.</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <div class="record-card">
        <strong>Symptom:</strong> ${item.main} (${item.duration}, Severity: ${item.severity})<br>
        <strong>Triggers:</strong> ${item.triggers || 'None'}<br>
        <strong>Questions:</strong> <ul>${item.questions.map(q => `<li>${q}</li>`).join('')}</ul>
        <small>Saved on: ${new Date(item.createdAt).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="error-text">Could not load local records.</p>';
  }
}
