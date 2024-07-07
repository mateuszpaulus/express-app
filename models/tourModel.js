const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Must have max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Must have difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Must have price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Must have image cover'],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;