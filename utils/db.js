const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(
      `mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true });

    this.connected = false;
    this.db = null;

    this.client.connect().then(() => {
      this.db = this.client.db(this.database);
      this.connected = true;
    }).catch((err) => {
      this.connected = false;
    });

  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    const users = this.db.collection('users');
    const count = await users.countDocuments();
    return count;
  }

  async nbFiles() {
    const files = this.db.collection('files');
    const count = await files.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();

export default dbClient;
