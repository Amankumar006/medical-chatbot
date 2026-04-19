const fs = require('node:fs');
const path = require('node:path');

const kbPath = path.join(__dirname, '../../../data/medical_kb/common.json');
let KB = [];

function loadKb() {
  if (KB.length) return KB;
  const raw = fs.readFileSync(kbPath, 'utf8');
  KB = JSON.parse(raw);
  return KB;
}

function retrieveContext(query = '', limit = 3) {
  const normalized = query.toLowerCase();
  const kb = loadKb();

  const scored = kb
    .map((doc) => {
      const score = doc.keywords.reduce((acc, keyword) => {
        return acc + (normalized.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);
      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

module.exports = { retrieveContext, loadKb };
