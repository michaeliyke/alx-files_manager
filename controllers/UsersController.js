import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const crypto = require('crypto');

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const users = dbClient.db.collection('users');
  if ((await users.findOne({ email }))) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const hashedPassword = crypto.createHash('sha1');
  hashedPassword.update(password).digest('hex');

  const newUser = {
    email,
    password: hashedPassword,
  };

  const result = await users.insertOne(newUser);
  return res.status(201).json({ id: result.insertedId, email: newUser.email });
};

const getMe = async (req, res) => {
  const { token } = req.headers;
  const users = dbClient.db.collection('users');
  const userId = await redisClient.get(`auth_${token}`);
  const user = await users.findOne({ userId });
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ email: user.email, id: user._id });
};

export default { postNew, getMe };
