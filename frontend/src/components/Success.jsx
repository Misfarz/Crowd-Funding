import React, { useState,useEffect } from 'react'
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'
import confetti from "canvas-confetti";

function Success() {
  const navigate = useNavigate();
  const [details ,setDetails] = useState(null)

 
  useEffect(() => {


    try {

     const token = sessionStorage.getItem("paymentToken");
     if (!token) return navigate("/");
     const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("paymentToken");
        return navigate("/");
     }

      setDetails(decoded);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      sessionStorage.removeItem("paymentToken");
        
    } catch (error) {
        navigate('/')
    }

  
  }, [navigate]);

   if (!details) return null;

   return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-10 text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-semibold">Payment Successful 🎉</h1>
        <p className="text-gray-400 mt-4">
          Thank you, <span className="text-white font-medium">{details.name}</span>!
          Your contribution of ₹{details.amount} is appreciated.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gradient-to-r from-red-600 to-red-800 px-10 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
    
}

export default Success