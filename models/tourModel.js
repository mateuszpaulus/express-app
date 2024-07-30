const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have name'],
    unique: true,
    trim: true,
    maxLength: [40, 'A tour name must have less or equal than 40 characters'],
    minLength: [10, 'A tour name must have more or equal than 10 characters'],
    validate: [validator.isAlpha, 'Tour name must only contains characters'],
  },
  slug: String,
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
    enum: {
      values: ['easy', 'medium', 'difficulty'],
      message: 'Difficulty is either: easy, medium, difficulty'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, 'Rating must be above 1.0'],
    max: [10, 'Rating must be below 10.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Must have price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Price discount ({VALUE}) should be below regular price',
    }
  },
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
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Document middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

//Query middleware
tourSchema.pre(/^find/, function (next) {
// tourSchema.pre('find', function (next) {
  this.find({secretTour: {$ne: true}});
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;