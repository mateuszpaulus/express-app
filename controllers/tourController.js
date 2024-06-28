const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.checkId = (req, res, next, val) => {
  const tourById = tours.find(tour => tour.id === val);
  if (!tourById) {
    return res.status(404).json({
      status: 'Error',
      message: 'No such tour',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Error',
      message: 'Missing data'
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    }
  });
};

exports.getTour = (req, res, next, val) => {
  const tourById = tours.find(tour => tour.id === val);

  res.status(200).json({
    status: 'Success',
    data: {
      tour: tourById,
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTour), (err) => {
    res.status(201).json({
      status: 'done',
      data: {
        tour: newTour
      }
    });
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tour: 'update',
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null
  });
};