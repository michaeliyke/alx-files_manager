const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.connected = false;

    this.ready = new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        this.connected = true;
        resolve();
      });
    });

    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
    });
  }

  async isAlive() {
    await this.ready;
    return this.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
