const express = require("express");
const mongoose = require("mongoose");
const cors =require('cors')
const dotenv=require("dotenv")


dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Connected!')).catch((err) => console.log(err));




const app = express();
app.use(express.json());
app.use(cors())

const userRouter = require("./routes/user.routes")
const courseRouter = require('./routes/course');
const moduleRouter = require('./routes/module');
const lessonRouter = require('./routes/lesson');
const quizRouter = require('./routes/quiz');
const questionRouter = require('./routes/question');
const certificateRouter = require('./routes/certificate');
const admin=require('./routes/admin')
const payment = require('./routes/payment')
let cart=require('./routes/cart')
let coupon=require('./routes/coupon')
let categoreyRouter=require('./routes/categoreyRoute')
let subcategoreyRouter=require('./routes/subcategoreyroutes')
let topicRouter=require('./routes/topicRoutes')
// let certificateRouter=require('./routes/certificateroutes')

app.use("/user",userRouter)
app.use('/categorey',categoreyRouter)
app.use('/subcategorey',subcategoreyRouter)
app.use('/topic',topicRouter)
// app.use('/certificate',certificateRouter)

app.use('/admin',admin)
app.use('/cart',cart)
app.use('/coupon',coupon)
app.use('/payment',payment)



app.use('/course', courseRouter);
app.use('/module', moduleRouter);
app.use('/lesson', lessonRouter);
app.use('/quiz', quizRouter);
app.use('/question', questionRouter);

app.use('/certificate', certificateRouter);

app.all("*",(req,res,next)=>{
  res.status(404).json({"status":"Failed","message":"Page not found"});
})
app.use(function (error, req, res, next) {
  console.log("error called");
  let statusCode = error.statusCode ? error.statusCode : 500;
  res.status(statusCode).json({status: "fail",message: error.message});
})
























app.listen(8000, () => {
  console.log("port is start");

})