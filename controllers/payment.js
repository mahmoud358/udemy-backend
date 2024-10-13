const PaymentModel = require('../models/payment');
const CartModel = require('../models/cart');
const { client } = require('../utils/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');

const completePayment = async (req, res) => {
    const userId = req.id;
    const { paymentMethod } = req.body;

    try {
        const cart = await CartModel.findOne({ userId, status: 'inProgress' }).populate('course_ids');
        if (!cart) return res.status(404).json({ message: "No active cart found" });

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
                    user_action: "PAY_NOW"
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
                course_ids: cart.course_ids,
                totalAmount: cart.totalPrice,
                paymentMethod
            });

            await payment.save();
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

                const payment = new PaymentModel({
                    userId: req.id,
                    course_ids: cart.course_ids,
                    totalAmount: cart.totalPrice,
                    paymentMethod: 'paypal',
                    paymentStatus: 'successful',
                    orderId
                });

                await payment.save();
                await CartModel.deleteOne({ _id: cart._id });

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
        const payments = await PaymentModel.find({ userId }).populate('course_ids');
        if (!payments.length) {
            return next(new APIERROR(404, "No payments found"));
        }

        res.status(200).json({ status: "success", data: payments });
    } catch (error) {
        return next(new APIERROR(500, error.message));
    }
};

module.exports = { completePayment, capturePayPalOrder, getAllUserPayments };

