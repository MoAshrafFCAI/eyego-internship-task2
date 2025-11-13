
const { Kafka } = require('kafkajs');
const TOPIC = process.env.KAFKA_TOPIC || 'user-activity';
const Activity = require('../persistence/activity.js');
const mongooseClient = require('../persistence/mongoose');

let consumer;
function initConsumer() {
  if (consumer) return consumer;
  const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  const kafka = new Kafka({ clientId: 'eyego-consumer', brokers });
  consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || 'eyego-group' });
  return consumer;
}

async function startConsumer() {
  if (process.env.KAFKA_DISABLED === 'true') {
    console.log('KAFKA_DISABLED=true so consumer not started');
    return;
  }
  await mongooseClient.connectIfNeeded();
  const c = initConsumer();
  await c.connect();
  await c.subscribe({ topic: TOPIC, fromBeginning: false });
  await c.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const raw = message.value.toString();
        const payload = JSON.parse(raw);
        // Basic processing: add processedAt if not present
        const doc = {
          userId: payload.userId,
          activityType: payload.activityType,
          payload: payload.payload || {},
          timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
          processedAt: new Date(),
          meta: { partition, offset: message.offset }
        };
        // save
        await Activity.create(doc);
        console.log('Processed and saved activity for', doc.userId);
      } catch (err) {
        console.error('Error processing message', err);
      }
    }
  });
}

module.exports = { startConsumer };
