const mongoose =require('mongoose');

const advertisementSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
    }

})
advertisementSchema.pre(/^find/,function(next){
    this.select('-__v')
    next();
})

const Advertisement = mongoose.model('Advertisement',advertisementSchema);
module.exports=Advertisement;