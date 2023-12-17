// Importing necessary libraries
const mongoose = require('mongoose');
const shortId = require('shortid');

// Defining a structure for the data we want to store in the database
const urlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('urlModel', urlSchema);
