const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res, next) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    res.status(200).json({
      status: 'Success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: `Fail: ${error}`,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: `Fail: ${error}`,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Done',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: `Fail creating Tour: ${error}`,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: `Fail creating Tour: ${error}`,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: {
        tour: null
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: `Fail: ${error}`,
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {$gte: 4.5},
        }
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: {$sum: 1},
          averageRating: {
            $avg: '$ratingsAverage',
          },
          averagePrice: {
            $avg: '$price',
          },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $max: '$price',
          },
        }
      },
      {
        $sort: {avgPrice: 1}
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: `Fail: ${error}`,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            $month: '$startDates'
          },
          numTourStatus: {$sum: 1},
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {$project: {_id: 0}},
      {
        $sort: {
          numTourStarts: -1
        }
      },
      {
        $limit: 12
      }
    ]);
    res.status(200).json({
      status: 'Success',
      data: {
        plan
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: `Fail: ${error}`,
    });
  }
};