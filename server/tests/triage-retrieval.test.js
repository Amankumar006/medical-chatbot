const test = require('node:test');
const assert = require('node:assert/strict');
const { scoreMessageRisk } = require('../src/services/triage');
const { retrieveContext } = require('../src/services/retrieval');

test('triage flags emergency chest pain', () => {
  const result = scoreMessageRisk('I have chest pain and cannot breathe');
  assert.equal(result.emergency, true);
  assert.equal(result.riskLevel, 'high');
});

test('retrieval returns flu context', () => {
  const result = retrieveContext('I have flu fever and cough');
  assert.ok(result.length > 0);
  assert.equal(result[0].topic, 'flu');
});
