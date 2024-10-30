const  mongoose  = require("mongoose");
const bcrypt = require("bcryptjs")

let AdminSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,'user password is required']
    },
})
AdminSchema.pre('save', async function(next){
    let salt= await bcrypt.genSalt(10)
   let hashPassword= await bcrypt.hash(this.password,salt)
   this.password=hashPassword
   next()
  })

const AdmiModels =mongoose.model('admin',AdminSchema)
module.exports=AdmiModels;

