const { v4: uuidv4 } = require('uuid');
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// GET /connect endpoint
const getConnect = async (req, res) => {
  const { email, password } = extractCredentials(req.headers.authorization);

  if (!email || !password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const users = dbClient.db.collection('users');
  const passwordHash = crypto.createHash('sha1');
  passwordHash.update(password).digest('hex');

  const user = await users.findOne({ email, password: passwordHash });
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = uuidv4();
  const key = `auth_${token}`;
  // Store the user ID in Redis for 24 hours
  redisClient.set(key, user._id, 'EX', 24 * 60 * 60);

  return res.status(200).json({ token });
};

function extractCredentials(authorization) {
  if (!authorization) return {};
  const base64Credentials = authorization.split(' ')[1];
  let credentials = Buffer.from(base64Credentials, 'base64');
  credentials = credentials.toString('ascii');
  const [email, password] = credentials.split(':');
  return { email, password };
}

// GET /disconnect endpoint
const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  redisClient.del(key);
  return res.status(204).end();
};

export default { getConnect, getDisconnect };
