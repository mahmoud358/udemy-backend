const express = require("express");
const mongoose = require("mongoose");
const cors =require('cors')
const dotenv=require("dotenv")
const http = require('http');
const Pusher = require("pusher");
const { auth } = require("./middleware/auth");

// const socket = require("./utils/socket");
const MessageModels = require("./models/message");


// const {Server} = require('socket.io');

dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Connected!')).catch((err) => console.log(err));




const app = express();
// const server = http.createServer(app);
// const io = new Server(server,{
//   cors:{
//     origin:"*"
//   }
// });
// app.set('io', io);
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

app.set('pusher', pusher);
app.use(express.json());
app.use(cors({
  origin:[
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost:5173",
    "https://udemy-next-nu.vercel.app",
    "https://udemy-backend-o9ln.vercel.app"
  ],
  methods:["GET","POST","PUT","DELETE","PATCH"],
  credentials:true
}))
  


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
let wishlistRouter=require('./routes/wishlist')
let reviewRouter=require('./routes/review')
let messageRouter=require('./routes/message');
// let certificateRouter=require('./routes/certificateroutes')

app.use("/user",userRouter)
app.use('/categorey',categoreyRouter)
app.use('/subcategorey',subcategoreyRouter)
app.use('/topic',topicRouter)
// app.use('/certificate',certificateRouter)
app.use('/wishlist',wishlistRouter)
app.use('/admin',admin)
app.use('/cart',cart)
app.use('/coupon',coupon)
app.use('/payment',payment)
app.use('/review',reviewRouter)
app.use('/message',messageRouter)

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



// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined their room`);
//   });

//   // socket.on('sendMessage', async (data) => {
//   //   const { senderId, receiverId, message } = data;
//   //   try {
//   //     const newMessage = await MessageModels.create({
//   //       senderId,
//   //       receiverId,
//   //       message
//   //     });
//   //     io.to(receiverId).emit('newMessage', newMessage);
//   //   } catch (error) {
//   //     console.error('Error sending message:', error);
//   //   }
//   // });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

app.listen(8000, () => {
  console.log("port is start");

})