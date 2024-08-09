const mongoose = require('mongoose')
const Item = require(`${__dirname}/itemModel`)
const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Enter your review']
  },
  user: {
    type: mongoose.Schema.ObjectId, //population data
    ref: 'User',
    required: [true, 'need token'],
    
  },
  item: {
    type: mongoose.Schema.ObjectId, //population data //String
    ref: 'Item',
    required: [true, "Item n't found"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
 // timestamps: true,
 // toJSON: { virtuals: true },
 // toObject: { virtuals: true },
})

reviewSchema.index({ item: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImage',


  }).select(' -__v');

  next();

})


reviewSchema.statics.calcAverageRatings = async function (itemId) {
  const stats = await this.aggregate([
    {
      $match: { item: itemId }
    },
    {
      $group: {
        _id: '$item',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },
   
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.item);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //.clone();//  clone() => work here,  to prevernt err:query has already executed
   
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
   //await this.findOne();// does NOT work here, query has already executed
  
  await this.r.constructor.calcAverageRatings(this.r.item);
});

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;
