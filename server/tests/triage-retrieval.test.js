const test = require('node:test');
const assert = require('node:assert/strict');
const { scoreMessageRisk } = require('../src/services/triage');
const { retrieveContext } = require('../src/services/retrieval');

test('triage flags emergency chest pain', () => {
  const result = scoreMessageRisk('I have chest pain and cannot breathe');
  assert.equal(result.emergency, true);
  assert.equal(result.riskLevel, 'high');
});

test('hybrid retrieval returns flu context for mixed symptom query', () => {
  const result = retrieveContext('I have influenza with fever and cough');
  assert.ok(result.length > 0);
  assert.equal(result[0].topic, 'flu');
});
