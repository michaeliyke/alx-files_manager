const express = require('express');
const crypto = require('crypto');
import dbClient from '../utils/db';
// import UUID from 'uuid';
const uuid = require('uuid');


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
    id: uuid.v4(),
  };

  users.insertOne(newUser);
  return res.status(201).json({ email: newUser.email, id: newUser.id });
}

module.exports = { postNew };
