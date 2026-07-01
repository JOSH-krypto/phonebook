require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('URI:', uri); // This should print your connection string

mongoose.connect(uri)
  .then(() => console.log('Connected successfully'))
  .catch(err => console.error('Connection failed:', err));
