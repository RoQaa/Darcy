const Review = require(`../models/reviewModel`)
const { catchAsync } = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);

exports.getReviews = (catchAsync(async (req, res, next) => {
    const data = await Review.find({ product: req.params.productId })

    if (!data) {
        return new next(new AppError(`data n't found`, 404))
    }

    res.status(200).json({
        status: true,
        message: "data returned",
        length: data.length,
        data
    })



}))

exports.addReviews = (catchAsync(async (req, res, next) => {
     req.body.user = req.user.id;
    await Review.create(req.body)
    res.status(200).json({
        status: true,
        message: "your review submitted"
    })
}))

exports.deleteReview = (catchAsync(async (req, res, next) => {
    const doc = await Review.findByIdAndDelete(req.params.id)


    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: true,
        message:"review Deleted"
    });
}))


exports.updateReview = (catchAsync(async (req, res, next) => {
    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(202).json({
        status: true,
        message:"review Updated",
        //doc
    });
}))

exports.updateUserReview=catchAsync(async(req,res,next)=>{
//const doc = await Review.findOneAndUpdate({_id:req.body.reviewId,user:req.user.id}, req.body, { new: true, runValidators: true })
const doc = await Review.findOne({
    _id: req.params.reviewId,
    user: req.user.id
  });

if(!doc ){
    return next(new AppError(`You are n't allowed to do this action`,404))
}

    // Update the document
    doc.set(req.body); // Set the new data
    await doc.save(); // Save the changes
  

  
res.status(200).json({
    status:true,
    message:"Review Updated",
   // doc
})
})

exports.deleteUserReview=catchAsync(async(req,res,next)=>{
    const doc = await Review.findOneAndDelete({
        _id: req.params.reviewId,
        user: req.user.id
      });
     if(!doc) return next (new AppError('not found',404))
    res.status(200).json({
        status: true,
        message:"review Deleted"
    });
})