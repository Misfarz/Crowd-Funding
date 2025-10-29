import React from 'react'

function Failed() {
     const navigate = useNavigate();

  // 🎉 Confetti animation
  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
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
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
        <h1 className="text-4xl font-semibold">Payment Successful 🎉</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Your support just fueled the dream closer to reality.  
          Thank you for believing in this journey!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-red-600 to-red-800 px-10 py-3 rounded-lg font-semibold tracking-wide border border-red-700 hover:from-red-700 hover:to-red-900 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Failed