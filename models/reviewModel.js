const mongoose = require('mongoose')
const Product = require(`./productModel`)
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Enter your review']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, //population data
    ref: 'User',
    required: [true, 'need token'],

  },
  product: {
    type: mongoose.Schema.Types.ObjectId, //population data //String
    ref: 'Product',
    required: [true, "Product n't found"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
}, {
  // timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

//reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImage',


  }).select(' -__v');

  next();

})


reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    },

  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();//  clone() => work here,  to prevernt err:query has already executed

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne();// does NOT work here, query has already executed

  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;
