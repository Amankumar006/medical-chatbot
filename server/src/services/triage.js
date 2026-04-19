const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /short(ness)? of breath/i,
  /can't breathe/i,
  /stroke/i,
  /face droop/i,
  /suicidal/i,
  /overdose/i,
  /seizure/i,
  /severe bleeding/i,
  /passed out|fainted/i
];

function scoreMessageRisk(message = '') {
  const matches = EMERGENCY_PATTERNS.filter((pattern) => pattern.test(message));
  const emergency = matches.length > 0;
  return {
    emergency,
    riskScore: emergency ? Math.min(1, 0.6 + matches.length * 0.1) : 0.1,
    riskLevel: emergency ? 'high' : 'low',
    matchedSignals: matches.map((pattern) => pattern.source)
  };
}

module.exports = { scoreMessageRisk };
