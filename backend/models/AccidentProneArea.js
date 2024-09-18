const mongoose = require('mongoose');

const accidentProneAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  severityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low',
  },
  dateReported: {
    type: Date,
    default: Date.now,
  },
});

const AccidentProneArea = mongoose.model('AccidentProneArea', accidentProneAreaSchema);

module.exports = AccidentProneArea;
