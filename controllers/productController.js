const multerConfig = require('../utils/MulterConfiguration'); // adjust the path as necessary
const imageResizer = require('../utils/ResizingMiddleware'); // adjust the path as necessary
const Product = require(`./../models/productModel`)
const Review=require(`./../models/reviewModel`)
const Category = require(`./../models/categoryModel`)
const { catchAsync } = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);
const APIFeatures = require(`./../utils/apiFeatures`);





// For product photos upload
exports.uploadProductPhotos = multerConfig.multipleUpload([
//  { name: 'backGroundImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);
exports.resizeProductImages =   imageResizer.resizeProductImages();


exports.addProduct = catchAsync(async (req, res, next) => {

  const data = await Product.create(req.body);

  res.status(200).json({
      status: true,
      message:`product created Successfully`,
      data
  })

})


exports.updateProduct=catchAsync(async(req,res,next)=>{
const data = await Product.findByIdAndUpdate(req.params.productId,req.body,{new:true,runValidators:true})

  if(!data){
    return next(new AppError(`Product not found`,404))
  }
  res.status(200).json({
    status:true,
    message:"Product Updated Successfully",
    //data
  })

})


exports.getProducts = catchAsync(async (req, res, next) => {
 
 const data = await Product.find({category:req.params.categoryId})
  


     if(!data||data.length===0){
         return next(new AppError(`data n't found`,404));
     }
    res.status(200).json({
    
        status: true,
        length:data.length,
        data
    })

})





exports.getOneProduct=catchAsync(async(req,res,next)=>{
const product=await Product.findById(req.params.productId).populate('reviews');
if(!product){
    return next(new AppError(`product not found`,404))
}
res.status(200).json({
    status:true,
    data:product   
})

})


exports.search = catchAsync(async (req, res, next) => {
  const searchTerm = req.body.word;

  const data = await Product.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } }
    ]
  });

  res.status(200).json({
    status: true,
    data
  });
});


exports.deleteProduct=catchAsync(async(req,res,next)=>{
  await Review.deleteMany({product:req.params.productId})
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