const PaymentModel = require('../models/payment');
const CartModel = require('../models/cart');
const { client } = require('../utils/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const { payoutsClient ,paypalPayoutsSdk } = require('../utils/paypalConfig');
const NotificationModel= require('../models/notification')
const MessageModel = require('../models/message')


const completePayment = async (req, res) => {
    const userId = req.id;
    const { paymentMethod } = req.body;

    try {
        const cart = await CartModel.findOne({ userId, status: 'inProgress' }).populate('course_ids');
        if (!cart) return res.status(404).json({ message: "No active cart found" });

        const totalAmount = cart.totalPrice;
        const platformShare = totalAmount * 0.30;
        const instructorShare = totalAmount * 0.70;

        if (paymentMethod === 'paypal') {
            let request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: cart.totalPrice.toString(),
                    }
                }],
                application_context: {
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
                    user_action: "PAY_NOW",
                    brand_name:"Udemy"
                }
            });

            let order = await client.execute(request);
            return res.status(201).json({
                approvalUrl: order.result.links.find(link => link.rel === 'approve').href,
                orderId: order.result.id
            });

        } else {
            const payment = new PaymentModel({
                userId,
                instructor_id: cart.course_ids[0].instructor_id, 
                course_ids: cart.course_ids,
                totalAmount: cart.totalPrice,
                platformShare,
                instructorShare,
                paymentMethod
            });

            

            const savedPayment = await payment.save();
            

            await CartModel.deleteOne({ _id: cart._id });
            res.status(200).json({ message: "Payment completed successfully", payment });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const capturePayPalOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const orderDetails = await client.execute(new paypal.orders.OrdersGetRequest(orderId));

        if (orderDetails.result.status === 'APPROVED') {
            let request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});
            let capture = await client.execute(request);

            if (capture.result.status === 'COMPLETED') {
                const cart = await CartModel.findOne({ userId: req.id }).populate('course_ids');
                if (!cart) return res.status(404).json({ message: "No active cart found" });


                const totalAmount = cart.totalPrice;
                const platformShare = totalAmount * 0.30;
                const instructorShare = totalAmount * 0.70;

                const payment = new PaymentModel({
                    userId: req.id,
                    course_ids: cart.course_ids,
                    instructor_id: cart.course_ids[0].instructor_id,
                    totalAmount: cart.totalPrice,
                    platformShare,
                    instructorShare,
                    paymentMethod: 'paypal',
                    paymentStatus: 'successful',
                    orderId
                })
// console.log("payment",payment);
                await payment.save();
                await CartModel.deleteOne({ _id: cart._id });
                const newMessage= await MessageModel.create({
                    senderId: payment.instructor_id,
                    receiverId: req.id,
                    message: `welcome in ${payment.course_ids[0].name.en} course`
                })
                const notificationOfInstructor= await NotificationModel.create({
                    userId: payment.instructor_id,
                    content: `New payment received for ${payment.course_ids[0].name.en} course`,
                    type: "payment",
                    // sender: req.id
                })
                const notificationOfUser= await NotificationModel.create({
                    userId: req.id,
                    content: newMessage.message,
                    type: "message",
                    sender: payment.instructor_id
                })
                const pusher = req.app.get('pusher');
                await pusher.trigger(`chat-${req.id}`, 'newMessage', newMessage);

                await pusher.trigger(`notification-${payment.instructor_id}`, 'newNotification', notificationOfInstructor);
                await pusher.trigger(`notification-${req.id}`, 'newNotification', notificationOfUser);

                return res.status(200).json({ message: "Payment completed successfully", payment });
            } else {
                return res.status(400).json({ message: "Payment not successful" });
            }
        } else {
            return res.status(400).json({ message: "Order not approved for capture" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllUserPayments = async (req, res, next) => {
    const userId = req.id;  

    try {
        const payments = await PaymentModel.find({ userId }) .populate({
            path: 'course_ids',
            populate: {
                path: 'instructor_id',  
                select: 'username '  
            }
        });

        if (!payments.length) {
            return next(new APIERROR(404, "No payments found"));
        }

        res.status(200).json({ status: "success", data: payments });
    } catch (error) {
        return next(new APIERROR(500, error.message));
    }
};



const triggerInstructorPayout = async (req, res) => {
    const paymentId = req.params.paymentId;

    try {
        
        const payment = await PaymentModel.findById(paymentId).populate('instructor_id');
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        if (payment.instructorPaid) return res.status(400).json({ message: "Instructor has already been paid" });

        
       // const instructorPaypalEmail = 'sb-zohjr33335588@business.example.com';  // Test email for PayPal sandbox


      const instructorPaypalEmail = payment.instructor_id.paypalEmail; 
        if (!instructorPaypalEmail) return res.status(400).json({ message: "Instructor PayPal email not found" });

    
        let request = new paypalPayoutsSdk.payouts.PayoutsPostRequest();
        request.requestBody({
            sender_batch_header: {
                recipient_type: "EMAIL",
                email_message: "Instructor Payout",
                note: "Thank you for using our platform",
                sender_batch_id: `Payout-${Date.now()}`, 
                email_subject: "Payout Received!"
            },
            items: [{
                recipient_type: "EMAIL",
                amount: {
                    value: payment.instructorShare.toFixed(2), 
                    currency: "USD" 
                },
                receiver: instructorPaypalEmail, 
                note: "Payout for courses",
                sender_item_id: `PayoutItem-${Date.now()}` 
            }]
        });

        
        const payoutResponse = await payoutsClient.execute(request);

        
        if (payoutResponse.statusCode === 201) {
            
            payment.instructorPaid = true;
            await payment.save();

            res.status(200).json({ message: "Payout completed successfully", payoutResponse });
        } else {
            res.status(400).json({ message: "Failed to send payout" });
        }
    } catch (error) {
        res.status(500).json({ message: ` adwdccada addadh${error.message}` });
    }
};

const getInstructorPayments = async (req, res) => {
    const instructorId = req.params.instructorId;
  
    try {
      
      const payments = await PaymentModel.find({ instructor_id: instructorId }).populate('course_ids', 'name')  
      .populate('instructor_id', 'username');  
  
      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payments found for this instructor" });
      }
  
      res.status(200).json({ status: 'success', data: payments });
    } catch (error) {
      res.status(500).json({ message: `Error fetching payments: ${error.message}` });
    }
  };



  const getPaymentsByUserId = async (req, res, next) => {
    const userId = req.params.userId;  

    try {
        const payments = await PaymentModel.find({ userId })  
            // .populate('course_ids', 'name')  
            // .populate('instructor_id', 'username');  

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this user" });
        }

        res.status(200).json({ status: 'success', data: payments });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching payments: ${error.message}` });
    }
};


const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentModel.find()
            .populate('userId', 'username')  
            .populate({
                path: 'course_ids',
                populate: {
                    path: 'instructor_id',
                    select: 'username'
                }
            });
        
        if (!payments.length) {
            return res.status(404).json({ message: "No payments found" });
        }

        res.status(200).json({ status: 'success', data: payments });
    } catch (error) {
        res.status(500).json({ message: `Error fetching payments: ${error.message}` });
    }
};

  



module.exports = { completePayment, capturePayPalOrder, getAllUserPayments,triggerInstructorPayout ,getInstructorPayments,getPaymentsByUserId,getAllPayments };

