/**
 * Post-Visit Consultation Summary Controller
 * Manages user-controlled post-visit summary notes written after a doctor visit.
 */
import { db } from '../services/db.js';

export async function renderSummaryModule(container) {
  container.innerHTML = `
    <div class="summary-module">
      <div class="module-header">
        <h2><i class="fas fa-file-medical"></i> Post-Visit Consultation Summary</h2>
        <p>Record what the doctor advised, instructions, and follow-up dates in your own words.</p>
      </div>

      <div class="summary-card">
        <div class="form-group">
          <label>Doctor / Clinic Name:</label>
          <input type="text" id="doc-name" placeholder="e.g. Dr. Sharma, PHC Center">
        </div>
        <div class="form-group">
          <label>Consultation Date:</label>
          <input type="date" id="consult-date">
        </div>
        <div class="form-group">
          <label>Doctor's Advice & Diagnosis Notes:</label>
          <textarea id="doctor-advice" rows="4" placeholder="What did the doctor advise? Note down instructions..."></textarea>
        </div>
        <div class="form-group">
          <label>Next Follow-up Date:</label>
          <input type="date" id="followup-date">
        </div>
        <button id="save-summary-btn" class="primary-btn"><i class="fas fa-save"></i> Save Summary (100% On-Device)</button>
      </div>

      <div id="saved-summaries" class="saved-list">
        <h3>Saved Consultation Summaries</h3>
        <div id="summary-items-container">Loading summaries...</div>
      </div>
    </div>
  `;

  document.getElementById('consult-date').valueAsDate = new Date();
  await loadSummaries();

  document.getElementById('save-summary-btn').addEventListener('click', async () => {
    const doctor = document.getElementById('doc-name').value;
    const date = document.getElementById('consult-date').value;
    const advice = document.getElementById('doctor-advice').value;
    const followup = document.getElementById('followup-date').value;

    if (!advice) {
      alert('Please enter doctor advice notes.');
      return;
    }

    await db.add('consultation_summaries', { doctor, date, advice, followup });
    alert('Consultation summary saved securely on your device!');
    await loadSummaries();
  });
}

async function loadSummaries() {
  const container = document.getElementById('summary-items-container');
  if (!container) return;
  try {
    const items = await db.getAll('consultation_summaries');
    if (items.length === 0) {
      container.innerHTML = '<p class="empty-text">No consultation summaries recorded yet.</p>';
      return;
    }
    container.innerHTML = items.map(item => `
      <div class="record-card">
        <strong>Doctor:</strong> ${item.doctor || 'General Consultation'} (${item.date})<br>
        <strong>Advice:</strong> ${item.advice}<br>
        <strong>Follow-up:</strong> ${item.followup || 'None scheduled'}<br>
        <small>Recorded on: ${new Date(item.createdAt).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="error-text">Could not load local summaries.</p>';
  }
}
