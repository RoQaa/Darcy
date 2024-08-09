const multerConfig = require('../utils/MulterConfiguration'); // adjust the path as necessary
const imageResizer = require('../utils/ResizingMiddleware'); // adjust the path as necessary
const Item = require(`${__dirname}/../models/itemModel`)
const Review=require(`${__dirname}/../models/reviewModel`)
const Category = require(`${__dirname}/../models/categoryModel`)
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);




// For product photos upload
exports.uploadProductPhotos = multerConfig.multipleUpload([
  { name: 'backGroundImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);
exports.resizeProductImages = (productId) => imageResizer.resizeProductImages(productId);


exports.updateItem=catchAsync(async(req,res,next)=>{
const data = await Item.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

  if(!data){
    return next(new AppError(`Item not found`,404))
  }
  res.status(200).json({
    status:true,
    message:"Item Updated Successfully",
    //data
  })

})


exports.addItem = catchAsync(async (req, res, next) => {

  const data = await Item.create(req.body);

  res.status(200).json({
      status: true,
      message:`item created Successfully`,
      data
  })

})


exports.getItems = catchAsync(async (req, res, next) => {
 
 
    const   data = await Item.aggregate([
        {
          $lookup: {
            from: Category.collection.name,
            localField: 'category',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  title: 1,
                },
              },
              {
                $match: {
                  title: req.body.title,
                },
              },
            ],
            as: 'category',
          },
        },
        {
          $match: {
            'category.title': req.body.title,
              
          },
        },
        {
          $project: {
            __v: 0,
           // category:0,
            images:0,
            About:0
          },
        },
      ]);
    


     if(!data||data.length===0){
         return next(new AppError(`data n't found`,404));
     }
    res.status(200).json({
    
        status: true,
        length:data.length,
        data
    })

})





exports.getSpecificItem=catchAsync(async(req,res,next)=>{
const item=await Item.findById(req.body.itemId).populate('reviews');
if(!item){
    return next(new AppError(`item not found`,404))
}
res.status(200).json({
    status:true,
    data:item   
})

})
exports.getSpecificItemByAdmin=catchAsync(async(req,res,next)=>{
  const item=await Item.findById(req.params.id).populate('reviews');
  if(!item){
      return next(new AppError(`item not found`,404))
  }
  res.status(200).json({
      status:true,
      data:item   
  })
  
  })

exports.search=catchAsync(async(req,res,next)=>{
  

 const data = await Item.find({
  name:{
    $regex:req.body.word,
    $options:"i"
  }
 })

  res.status(200).json({
    status:true,
    data
  })
})

exports.deleteItem=catchAsync(async(req,res,next)=>{
  await Review.deleteMany({item:req.params.id})
  const item = await Item.findByIdAndDelete(req.params.id)
  if(!item){
    return next(new AppError(`Item not found`,404))
  }
  res.status(202).json({
    status:true,
    data:null
  })
})




exports.aliasTopItems = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,description,backGroundImage';
  next();
};

exports.getAllItems=catchAsync(async(req,res,next)=>{
      // EXECUTE QUERY
      const features = new APIFeatures(Item.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const items = await features.query;
    if(!items){
      return next(new AppError(`Data n't found`,404))
    }
    res.status(200).json({
      status:true,
      length:items.length,
      data:items
    })
})


exports.getAllItemsOfCategoreis=catchAsync(async(req,res,next)=>{
  // EXECUTE QUERY
  const features = new APIFeatures(Item.find({category:req.params.id}), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const items = await features.query;
if(!items){
  return next(new AppError(`Data n't found`,404))
}
res.status(200).json({
  status:true,
  length:items.length,
  data:items
})
})