const mongoose=require("mongoose")

let categoreySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please,Enter categorey name first"],
        unique:[true,'this name is already exist , categorey name must be unique'],
        minLength:3,
        maxLength:[16, " maximum length is 16 letter"]
    },
    description:{
        type:String,
        minLength:0,
        maxLength:[3000, " maximum length is 40 letter"]

    },

    subcategorey:{
        type:mongoose.Schema.ObjectId,
        ref:"subcategories",
        required:[true,"Please, Enter your subcategorey"]
    }

},{Collection:'categorey'})

const categoreymongoose=mongoose.model('categorey',categoreySchema)
    
 module.exports=categoreymongoose
