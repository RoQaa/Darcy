const multer=require('multer')

const path=require('path')
const sharp=require('sharp')
const Category=require(`${__dirname}/../models/categoryModel`)
const Item =require(`${__dirname}/../models/itemModel`)
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    console.log(file)
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCatPhoto = upload.single('image');

exports.resizeCatPhoto = async (req, res, next) => {
  if (!req.file) return next();

  const Extension =  path.extname(req.file.originalname)//mime.extension(req.file.mimetype);
 const fileExtension=Extension.replace('.','')

  // Validate file extension
  if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
    return next(new Error('Unsupported file format!'));
  }

  const filename = `cat-${req.params.id}-${Date.now()}.${fileExtension}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat(fileExtension)
    .jpeg({ quality: 90 }) // You can adjust options based on the file format
    .toFile(`public/img/cats/${filename}`);

  req.file.filename = filename;

  next();
};
  



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


exports.addCategory=catchAsync(async(req,res,next)=>{
    
    const data = await Category.create(req.body);
        res.status(201).json({
            status:true,
            message:"Category Created Successfully",
            data
        })

})


exports.updateCategory=catchAsync(async(req,res,next)=>{
if(req.file) req.body.image=`https://dalilalhafr.com/api/public/img/cats/${req.file.filename}`
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
  await Item.deleteMany({category:catId})
  
 const cat= await Category.findByIdAndDelete(catId)
  if(!cat){
    return next(new AppError(`Category not found`,404))

  }
  res.status(200).json({
    status:true,
    message:"Category and her Items deleted Successfully"
  })
})