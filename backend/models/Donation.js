import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  email: String,
  amount: Number,
  paymentId: String,
  orderId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Donation", donationSchema);
