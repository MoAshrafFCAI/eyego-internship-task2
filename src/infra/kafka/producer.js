const { Kafka } = require('kafkajs');
const TOPIC = process.env.KAFKA_TOPIC || 'user-activity';

let producer;
let kafka;

function initKafka() {
  if (producer) return producer;
  const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  kafka = new Kafka({ clientId: 'eyego-producer', brokers });
  producer = kafka.producer();
  return producer;
}

async function ensureConnected() {
  const p = initKafka();
  try {
    await p.connect();
  } catch (err) {
    throw err;
  }
}

async function sendEvent(event) {

  if (process.env.KAFKA_DISABLED === 'true') {
    console.log('KAFKA_DISABLED=true so skipping send.');
    return;
  }
  const p = initKafka();
  await ensureConnected();
  await p.send({
    topic: TOPIC,
    messages: [
      { key: event.userId?.toString() || null, value: JSON.stringify(event) }
    ]
  });
}

module.exports = { sendEvent };
