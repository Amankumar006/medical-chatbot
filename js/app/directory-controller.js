/**
 * Care Navigation Directory Controller
 * Plain-language "how to access care" directory for local public services (PHCs, CHCs, Ayushman Arogya Mandirs, eSanjeevani).
 */
import { db } from '../services/db.js';

export async function renderDirectoryModule(container) {
  container.innerHTML = `
    <div class="directory-module">
      <div class="module-header">
        <h2><i class="fas fa-map-marked-alt"></i> Local Public Care Directory</h2>
        <p>Plain-language guide to local public health services, clinics, and digital health hubs.</p>
      </div>

      <div class="directory-search">
        <input type="text" id="dir-search" placeholder="Search facilities (e.g. PHC, Ayushman Arogya Mandir, eSanjeevani)...">
      </div>

      <div id="directory-results" class="directory-grid">
        <!-- Default local care facilities -->
      </div>

      <div class="add-facility-card">
        <h3>Add Local Facility / Helper Contact</h3>
        <div class="form-group">
          <input type="text" id="fac-name" placeholder="Facility Name (e.g. Sub-Center PHC)">
        </div>
        <div class="form-group">
          <input type="text" id="fac-type" placeholder="Type (e.g. PHC, ASHA Worker, eSanjeevani Hub)">
        </div>
        <div class="form-group">
          <input type="text" id="fac-details" placeholder="Details & Timings / Contact info">
        </div>
        <button id="add-fac-btn" class="secondary-btn"><i class="fas fa-plus"></i> Save Facility Locally</button>
      </div>
    </div>
  `;

  await loadDirectory();

  document.getElementById('add-fac-btn').addEventListener('click', async () => {
    const name = document.getElementById('fac-name').value;
    const type = document.getElementById('fac-type').value;
    const details = document.getElementById('fac-details').value;

    if (!name) {
      alert('Please enter facility name.');
      return;
    }

    await db.add('care_directory', { name, type, details, isCustom: true });
    alert('Facility saved locally!');
    await loadDirectory();
  });

  document.getElementById('dir-search').addEventListener('input', (e) => {
    filterDirectory(e.target.value);
  });
}

const defaultFacilities = [
  { name: 'Ayushman Arogya Mandir (Health & Wellness Center)', type: 'PHC', details: 'Free primary screening, immunizations, basic medications. Open Mon-Sat 9AM-4PM.' },
  { name: 'Community Health Center (CHC)', type: 'CHC', details: '24/7 emergency care, maternity ward, pediatric & general physician consultation.' },
  { name: 'eSanjeevani Teleconsultation Hub', type: 'Digital Health', details: 'Free doctor video consultation kiosk supported by Ministry of Health and Family Welfare.' },
  { name: 'ASHA / CHO Community Help Desk', type: 'Community Worker', details: 'Assistance with pregnancy tracking, immunization cards, and local public health scheme navigation.' }
];

async function loadDirectory() {
  const container = document.getElementById('directory-results');
  if (!container) return;

  let customFacilities = [];
  try {
    customFacilities = await db.getAll('care_directory');
  } catch (e) {}

  const all = [...defaultFacilities, ...customFacilities];
  renderFacilities(all, container);
}

function renderFacilities(list, container) {
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-text">No facilities found.</p>';
    return;
  }
  container.innerHTML = list.map(f => `
    <div class="facility-card">
      <span class="badge">${f.type || 'Public Service'}</span>
      <h3>${f.name}</h3>
      <p>${f.details}</p>
    </div>
  `).join('');
}

function filterDirectory(query) {
  const container = document.getElementById('directory-results');
  if (!container) return;
  const q = query.toLowerCase();
  const filtered = defaultFacilities.filter(f =>
    f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.details.toLowerCase().includes(q)
  );
  renderFacilities(filtered, container);
}
