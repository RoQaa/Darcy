const mongoose= require('mongoose');
const categorySchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please Enter Category title'],
        trim:true,
        unique:[true,'You already have Category with the same name']
    },
    image:{
        type:String,
      //  required:[true,'Please Enter Image'],
      default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63XIy9VsNtzBDN5WqZPXvBpoHdmq8YUlSYEfwNghm0Q&s'
       
    }
})

categorySchema.pre(/^find/, function (next) {
    this.find().select('-__v')
    
    /*.populate({
        path: 'category',
        select: 'title ',
       
      })
*/
    next();

  })

const Category=mongoose.model('Category',categorySchema);

module.exports=Category