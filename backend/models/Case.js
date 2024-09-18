const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  PatientName:{
    type: String,
    required:true
  },
  VehicleNumber: {
    type: String,
    required: true,
  },
  AccidentReporterName: {
    type: String,
    required: false,
    default : "self"
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

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
