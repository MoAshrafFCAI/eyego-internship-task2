
const express = require('express');
const router = express.Router();
const producer = require('../infra/kafka/producer');
const mongooseClient = require('../infra/persistence/mongoose');
const Activity = require('../infra/persistence/activity.js');


router.post('/events', async (req, res) => {
  const body = req.body;
  if (!body || !body.userId || !body.activityType) {
    return res.status(400).json({ error: 'userId and activityType required' });
  }
  try {
    await producer.sendEvent(body);
    return res.status(202).json({ status: 'accepted' });
  } catch (err) {
    console.error('Producer error:', err);
    return res.status(500).json({ error: 'failed to produce event' });
  }
});


router.get('/logs', async (req, res) => {
  
  await mongooseClient.connectIfNeeded();

  const { userId, activityType, page = 1, limit = 20, start, end } = req.query;
  const filter = {};
  if (userId) filter.userId = userId;
  if (activityType) filter.activityType = activityType;
  if (start || end) {
    filter.timestamp = {};
    if (start) filter.timestamp.$gte = new Date(start);
    if (end) filter.timestamp.$lte = new Date(end);
  }

  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, parseInt(limit) || 20);

  try {
    const [items, total] = await Promise.all([
      Activity.find(filter).sort({ timestamp: -1 }).skip((p - 1) * l).limit(l).lean(),
      Activity.countDocuments(filter),
    ]);
    res.json({ page: p, limit: l, total, items });
  } catch (err) {
    res.status(500).json({ error:'error fetching logs', details: err.message });
  }
});

module.exports = router;
