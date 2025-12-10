const admin = require('../utils/FirebaseConfig/firebaseConfig');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'Missing Bearer token' });

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, requireRole };