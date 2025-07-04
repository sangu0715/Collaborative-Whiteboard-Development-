const mongoose = require('mongoose');

const drawingCommandSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['stroke', 'clear'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  drawingData: [drawingCommandSchema]
});

module.exports = mongoose.model('Room', roomSchema);