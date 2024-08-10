const multerConfig = require('../utils/MulterConfiguration'); // adjust the path as necessary
const imageResizer = require('../utils/ResizingMiddleware'); // adjust the path as necessary
const Category=require(`../models/categoryModel`)
const Product =require(`../models/productModel`)
const { catchAsync } = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);

exports.uploadCatPhoto = multerConfig.singleUpload('image');
exports.resizeCatPhoto =imageResizer.resizePhoto('cat','cats');


exports.getCategories=catchAsync(async(req,res,next)=>{

    const cats= await Category.find();
    if(!cats){
        return next(new AppError("Data n't found",404));
    }
    res.status(200).json({
        status:true,
        data:cats
    })
})

exports.getOneCategory=catchAsync(async(req,res,next)=>{
  const doc = await Category.findById(req.params.id);
  if(!doc) return next(new AppError(`Not found`,404))
    res.status(200).json({
      status:true,
      data:doc
  })
})

exports.addCategory=catchAsync(async(req,res,next)=>{
    if(req.file) req.body.image=`public/img/cats/${req.file.filename}`
    const data = await Category.create(req.body)
    
        res.status(201).json({
            status:true,
            message:"Category Created Successfully",
            data
        })

})


exports.updateCategory=catchAsync(async(req,res,next)=>{
if(req.file) req.body.image=`public/img/cats/${req.file.filename}`
const data = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
if(!data){
    return next(new AppError(`Category not found`,404))
  }
  res.status(200).json({
    status:true,
    message:"Category Updated Successfully",
  //  data
  })
})


exports.deleteCategory=catchAsync(async(req,res,next)=>{
  const catId=req.params.id;
  await Product.deleteMany({category:catId})
  
 const cat= await Category.findByIdAndDelete(catId)
  if(!cat){
    return next(new AppError(`Category not found`,404))

  }
  res.status(200).json({
    status:true,
    message:"Category and her Products deleted Successfully"
  })
})