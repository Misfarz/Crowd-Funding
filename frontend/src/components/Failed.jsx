import React, { useEffect } from 'react'
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Failed() {
    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem("paymentToken");
      if (!token) navigate("/");
    }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Overlay */}
      <div className="absolute inset-0">
        <img
          src="/cover.png"
          alt="Dream Porsche"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-10 shadow-lg space-y-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
        <h1 className="text-4xl font-semibold text-white">Payment Failed</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Something went wrong while processing your payment.  
          Don’t worry — you can try again anytime!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-gray-700 to-gray-900 px-10 py-3 rounded-lg font-semibold tracking-wide border border-gray-700 hover:from-gray-800 hover:to-gray-950 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default Failed