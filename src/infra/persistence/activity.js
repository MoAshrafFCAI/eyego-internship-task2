
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ActivitySchema = new Schema({
  userId: { type: String, required: true, index: true },
  activityType: { type: String, required: true, index: true },
  payload: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
  processedAt: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed }
});
ActivitySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
