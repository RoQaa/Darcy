const mongoose=require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The name of the color (e.g., 'Red', 'Blue')
  hexaCode:{ type: String, required: true },
  image: { type: String, required: true }, // The URL or path to the image for this color
});

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product must have a name'],
        unique:[true,'You already have product with the same name']
    },
    description:{
        type:String,
    },
 
    colors: [colorSchema], // Array of color objects
    category:{
        type: mongoose.Schema.Types.ObjectId, //population data
        ref: 'Category',
        required: [true, 'Choose Your Category'],
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
      size:[{
        type:String,
        required:true,
      }],
      price:{
        type:Number,
        required:true
      },
      createdAt:{type:Date,default:Date.now()}
  
},
{

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

  productSchema.index({ category: 1, name: 1 }, { unique: true });
  productSchema.index({ name: 'text', description: 'text' });

 // Virtual populate
 productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
  });
  

  productSchema.pre(/^find/,function (next){
    this.populate('category').select('-__v')
    next();
  })

  const Product=mongoose.model('Product',productSchema)

  module.exports=Product;