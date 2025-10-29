import express, { Router } from 'express'
import { createOrder,verifyPayment,fetchDonations } from '../controllers/PaymentController.js'

const router = express.Router();


router.post('/create-order',createOrder)
router.post("/verify-payment", verifyPayment);
router.get("/fetch-donations",fetchDonations)


export default router