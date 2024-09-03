import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getStatus = (req, res) => {
  const redisAlive = redisClient.isAlive();
  const dbAlive = dbClient.isAlive();

  res.status(200).json({ redis: redisAlive, db: dbAlive });
};

const getStats = async (req, res) => {
  try {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getStatus,
  getStats,
};
