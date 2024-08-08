const Review = require(`${__dirname}/../models/reviewModel`)
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

exports.getReviews = (catchAsync(async (req, res, next) => {
    const data = await Review.find({ item: req.body.itemId })

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
    const user = req.user.id;
    if (!req.body) {
        return next(new AppError(`data n't found`, 404))
    }
    req.body.user = user

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
    _id: req.body.reviewId,
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
    const doc = await Review.findOne({
        _id: req.body.reviewId,
        user: req.user.id
      });
      if(!doc ){
        return next(new AppError(`You are n't allowed to do this action`,404))
    }
    await doc.deleteOne(); // or existingReview.remove()
    res.status(200).json({
        status: true,
        message:"review Deleted"
    });
})