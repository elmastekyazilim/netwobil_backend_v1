const mongoose = require('mongoose');


const deviceSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
    unique: true,
  },
  lastMsg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Device', deviceSchema);

