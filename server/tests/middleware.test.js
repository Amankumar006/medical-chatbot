const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMessagePayload, validateUploadPayload } = require('../src/middleware/validation');
const { createRateLimiter } = require('../src/middleware/rate-limit');

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('validateMessagePayload rejects empty message', () => {
  const req = { body: { message: '   ' } };
  const res = createRes();
  let nextCalled = false;

  validateMessagePayload(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
});

test('validateUploadPayload accepts valid payload', () => {
  const req = { body: { content: 'report body', fileName: 'report.txt' } };
  const res = createRes();
  let nextCalled = false;

  validateUploadPayload(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test('rate limiter blocks requests above threshold', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
  const req = { path: '/api/chat', headers: {}, socket: { remoteAddress: '127.0.0.1' } };

  const res1 = createRes();
  let next1 = false;
  limiter(req, res1, () => {
    next1 = true;
  });

  const res2 = createRes();
  let next2 = false;
  limiter(req, res2, () => {
    next2 = true;
  });

  assert.equal(next1, true);
  assert.equal(next2, false);
  assert.equal(res2.statusCode, 429);
});
