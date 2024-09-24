const mongoose=require('mongoose')

const subcategoreySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please,Enter Subcategorey name first"],
        unique:[true,'this name is already exist , Subcategorey name must be unique'],
        minLength:3,
        maxLength:[16, " maximum length is 16 letter"]
    },
    description:{
        type:String,
       
        unique:false,
        minLength:0,
        maxLength:[16, " maximum length is 16 letter"]
    },
    topics: {
                type:[mongoose.Schema.ObjectId],
        ref:"topics",
        required:[true,"Please,Enter topic Id "]
    }
    
    
},{Collection:'subcategories'})


subcategoreySchema.pre(/^find/,function(next){
    this.populate({
        path:"topics",
        select:"name"
    });

    next()

})

subcategoreymongoose=mongoose.model('subcategories',subcategoreySchema)
module.exports=subcategoreymongoose
