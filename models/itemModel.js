const mongoose=require('mongoose');

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Item must have a name'],
        unique:[true,'You already have item with the same name']
    },
    description:{
        type:String,
    },
    backGroundImage:{
        type:String,
      // required:[true,'Please Enter  an Image'],
       
    },
    category:{
        type: mongoose.Schema.ObjectId, //population data
        ref: 'Category',
        required: [true, 'Choose Your Category'],
    },
    location:{
       
        type:String,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
    images:[String],
    About:String,
},




{
    //timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

  itemSchema.index({category:'text'})
  itemSchema.index({ name: 'text', description: 'text' });

 // Virtual populate
 itemSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'item',
    localField: '_id'
  });
  

  itemSchema.pre(/^find/, function (next) {
    this.find().select('-__v').populate({
        path: 'category',
        select: 'title ',
       
      })

    next();

  })
  

  const Item=mongoose.model('Item',itemSchema)

  module.exports=Item;