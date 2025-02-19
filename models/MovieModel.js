const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  posterimage: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true,
    // minlength: 2
  },
  description: {
    type: String,
    required: true
  },
  releaseYear: {
    type: String, 
    required: true
  },
  runningTime: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    required: true
  },
  videoUpload: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: true,
  },
  path :{
    type :String,
    required : true
  }
});

module.exports = mongoose.model("Movies", MovieSchema);