import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Donation from '../models/Donation.js'


export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      amount,
    } = req.body;

    // Create the signature body
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      // ✅ Save donation details to DB
      await Donation.create({
        name: name ,
        email,
        amount: Number(amount),
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};


export const fetchDonations = async (req,res) => {
  try {
     
    const donations = await Donation.find().sort({createdAt :-1}).limit(3)

    const sum = await Donation.aggregate([
      {$group : {_id:null , total : {$sum : "$amount"}}}
    ])  // this will create an array of [aggregation result]
    
    const total = sum.length > 0 ? sum[0].total : 0; // tried access that array [id:null, total : ]

    res.status(200).json({
      success:true,
      donations,
      total
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};