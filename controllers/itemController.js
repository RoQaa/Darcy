const multer =require('multer')
const sharp=require('sharp')
const Item = require(`${__dirname}/../models/itemModel`)
const Review=require(`${__dirname}/../models/reviewModel`)
const Category = require(`${__dirname}/../models/categoryModel`)
const { catchAsync } = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const multerFilter = (req, file, cb) => {
    
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//multiple
exports.uploadItemsPhotos = upload.fields([
  {name:"backGroundImage",maxCount:1},
  {name:"images",maxCount:10}
])

// upload.single('fieldName)
//upload.array('fieldname,maxCount)
//resize midlleWare
exports.resizeItemsImages = catchAsync(async (req, res, next) => {
if(!req.files.backGroundImage||!req.files.images) return next();
const path=`item-${req.params.id}-${Date.now()}-cover.jpeg`
req.body.backGroundImage = `https://dalilalhafr.com/api/public/img/items/item-${req.params.id}-${Date.now()}-cover.jpeg`;
//1) Background Image
await sharp(req.files.backGroundImage[0].buffer)
.resize(2000, 1333)
.toFormat('jpeg')
.jpeg({ quality: 90 })
.toFile(`public/img/items/${path}`);

// 2)Images
req.body.images = [];

await Promise.all(
  req.files.images.map(async (file, i) => {
    const filename = `item-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/items/${filename}`);

    req.body.images.push(`https://dalilalhafr.com/api/public/img/items/${filename}`);
    
  })
);
next();
});




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