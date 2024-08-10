const multerConfig = require('../utils/MulterConfiguration'); // adjust the path as necessary
const imageResizer = require('../utils/ResizingMiddleware'); // adjust the path as necessary
const Product = require(`${__dirname}/../models/productModel`)
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


exports.updateProduct=catchAsync(async(req,res,next)=>{
const data = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

  if(!data){
    return next(new AppError(`Product not found`,404))
  }
  res.status(200).json({
    status:true,
    message:"Product Updated Successfully",
    //data
  })

})


exports.addProduct = catchAsync(async (req, res, next) => {

  const data = await Product.create(req.body);

  res.status(200).json({
      status: true,
      message:`product created Successfully`,
      data
  })

})


exports.getProducts = catchAsync(async (req, res, next) => {
 
 
    const   data = await Product.aggregate([
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





exports.getSpecificProduct=catchAsync(async(req,res,next)=>{
const product=await Product.findById(req.body.productId).populate('reviews');
if(!product){
    return next(new AppError(`product not found`,404))
}
res.status(200).json({
    status:true,
    data:product   
})

})
exports.getSpecificProductByAdmin=catchAsync(async(req,res,next)=>{
  const product=await Product.findById(req.params.id).populate('reviews');
  if(!product){
      return next(new AppError(`product not found`,404))
  }
  res.status(200).json({
      status:true,
      data:product   
  })
  
  })

exports.search=catchAsync(async(req,res,next)=>{
  

 const data = await Product.find({
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

exports.deleteProduct=catchAsync(async(req,res,next)=>{
  await Review.deleteMany({product:req.params.id})
  const product = await Product.findByIdAndDelete(req.params.id)
  if(!product){
    return next(new AppError(`Product not found`,404))
  }
  res.status(202).json({
    status:true,
    data:null
  })
})




exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,description,backGroundImage';
  next();
};

exports.getAllProducts=catchAsync(async(req,res,next)=>{
      // EXECUTE QUERY
      const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query;
    if(!products){
      return next(new AppError(`Data n't found`,404))
    }
    res.status(200).json({
      status:true,
      length:products.length,
      data:products
    })
})


exports.getAllProductsOfCategoreis=catchAsync(async(req,res,next)=>{
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find({category:req.params.id}), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const products = await features.query;
if(!products){
  return next(new AppError(`Data n't found`,404))
}
res.status(200).json({
  status:true,
  length:products.length,
  data:products
})
})