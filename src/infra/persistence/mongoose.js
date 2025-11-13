const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eyego';

let connected = false;

async function connectIfNeeded() {
  if (connected) return;
  await mongoose.connect(MONGO_URI);
  connected = true;
  console.log('Connected to MongoDB');
}

module.exports = { connectIfNeeded };
