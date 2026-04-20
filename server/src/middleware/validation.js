function validateMessagePayload(req, res, next) {
  const { message } = req.body || {};
  if (typeof message !== 'string') {
    return res.status(400).json({ error: '`message` must be a string' });
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return res.status(400).json({ error: '`message` is required' });
  }

  if (trimmed.length > 1500) {
    return res.status(400).json({ error: '`message` exceeds 1500 characters' });
  }

  req.body.message = trimmed;
  return next();
}

function validateUploadPayload(req, res, next) {
  const { content, fileName } = req.body || {};

  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: '`content` must be a non-empty string' });
  }

  if (content.length > 100_000) {
    return res.status(400).json({ error: '`content` exceeds 100000 characters' });
  }

  if (fileName !== undefined && typeof fileName !== 'string') {
    return res.status(400).json({ error: '`fileName` must be a string when provided' });
  }

  return next();
}

module.exports = { validateMessagePayload, validateUploadPayload };
