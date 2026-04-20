const buckets = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter({ windowMs = 60_000, max = 30 } = {}) {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const state = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + windowMs;
    }

    state.count += 1;
    buckets.set(key, state);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - state.count)));

    if (state.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    return next();
  };
}

module.exports = { createRateLimiter };
