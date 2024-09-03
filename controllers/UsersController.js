import dbClient from '../utils/db';

const crypto = require('crypto');

const postNew = async (req, res) => {
  const { email, password } = req.body;
  const users = dbClient.db.collection('users');

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  if ((await users.findOne({ email }))) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const hashedPassword = crypto.createHash('sha1');
  hashedPassword.update(password).digest('hex');

  const newUser = {
    email,
    password: hashedPassword,
  };

  users.insertOne(newUser);
  console.log(newUser);
  return res.status(201).json({ email: newUser.email, id: newUser._id });
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
