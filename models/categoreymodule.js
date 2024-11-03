const mongoose=require("mongoose")

let categoreySchema=mongoose.Schema({
    name:{
       en:{
        type:String,
        required:[true,"Please,Enter categorey name first"],
        unique:[true,'this name is already exist , categorey name must be unique'],
        minLength:3,
        maxLength:[25, " maximum length is 25 letter"]
       },
       ar:{
        type:String,
        required:[true,"ادخل اسم الفئة"],
        unique:[true,'هذا الاسم موجود بالفعل، يجب أن يكون اسم الفئة مميز'],
        minLength:3,
        maxLength:[25, " الحد الأقصى للأحرف هو 25 حرف"]
       }
    },
    description:{
        type:String,
        minLength:0,
        maxLength:[3000, " maximum length is 40 letter"]

    },

    

},{Collection:'categorey'})

const categoreymongoose=mongoose.model('categorey',categoreySchema)
    
 module.exports=categoreymongoose
