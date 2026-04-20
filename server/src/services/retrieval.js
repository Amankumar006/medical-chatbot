const fs = require('node:fs');
const path = require('node:path');

const kbPath = path.join(__dirname, '../../../data/medical_kb/common.json');
let KB = [];

const SYNONYMS = {
  breath: ['breathing', 'respiratory', 'lungs'],
  flu: ['influenza', 'viral', 'fever', 'cough'],
  diabetes: ['blood sugar', 'hypoglycemia', 'glucose'],
  hypertension: ['blood pressure', 'bp'],
  dizzy: ['lightheaded', 'faint']
};

function loadKb() {
  if (KB.length) return KB;
  const raw = fs.readFileSync(kbPath, 'utf8');
  KB = JSON.parse(raw);
  return KB;
}

function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function expandTerms(tokens) {
  const expanded = new Set(tokens);
  tokens.forEach((token) => {
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((synonym) => expanded.add(synonym));
    }
  });
  return expanded;
}

function keywordScore(normalizedQuery, doc) {
  return doc.keywords.reduce((acc, keyword) => {
    return acc + (normalizedQuery.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
}

function semanticScore(queryTerms, doc) {
  const docTerms = expandTerms(tokenize(`${doc.topic} ${doc.summary} ${doc.keywords.join(' ')}`));
  let overlap = 0;

  queryTerms.forEach((term) => {
    if (docTerms.has(term)) overlap += 1;
  });

  return overlap / Math.max(1, queryTerms.size);
}

function retrieveContext(query = '', limit = 3) {
  const normalizedQuery = query.toLowerCase();
  const queryTerms = expandTerms(tokenize(query));
  const kb = loadKb();

  const scored = kb
    .map((doc) => {
      const lexical = keywordScore(normalizedQuery, doc);
      const semantic = semanticScore(queryTerms, doc);
      const score = lexical * 0.7 + semantic * 0.3;
      return { ...doc, lexical, semantic, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

module.exports = { retrieveContext, loadKb, tokenize, expandTerms };
