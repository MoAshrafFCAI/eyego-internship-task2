require('dotenv').config();
const { startConsumer } = require('./consumer');

startConsumer().catch(err => {
  console.error('Consumer failed to start', err);
  process.exit(1);
});


process.on('SIGINT', () => {
  console.log('Consumer shutting down');
  process.exit(0);
});
