
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});


process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
