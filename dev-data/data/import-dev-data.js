const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({path: './config.env'});

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log('MongoDB connection connected to MongoDB');
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tours created successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours deleted successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}