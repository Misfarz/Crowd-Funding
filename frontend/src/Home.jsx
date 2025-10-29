import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cover from './assets/cover.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentAmount, setCurrentAmount] = useState(2080000);
  const [targetAmount] = useState(10000000);
  const [donationAmount, setDonationAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    amount: '',
  });
  const [supporters, setSupporters] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/payment/fetch-donations"
        );
        if (res.data.success) {
            setSupporters(res.data.donations)
            setCurrentAmount(res.data.total)
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchData()

  }, []);

  const progressPercentage = (currentAmount / targetAmount) * 100;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  // ------------------------
  // Modal Handlers
  // ------------------------
  const handleOpenModal = () => {
    setDonationData((prev) => ({ ...prev, amount: donationAmount }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setDonationData({ ...donationData, [e.target.name]: e.target.value });
  };

  // ------------------------
  // Razorpay Payment Integration using Axios
  // ------------------------
  const handlePayment = async () => {
    const { name, email, amount } = donationData;

    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    try {
      // 1️⃣ Create Razorpay order via backend
      const {data } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount,
      });
     
      const {order, amount : orderAmount } = data
      // 2️⃣ Configure Razorpay options
      const options =  {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: orderAmount,
        currency: 'INR',
        name: 'Road to Porsche 🚗',
        description: 'Donation towards dream project',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment via backend
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              ...response,
              name,
              email,
              amount,
            });

            if (verifyRes.data.success) { 
              const {token} = verifyRes.data
              sessionStorage.setItem("paymentToken",token)
              navigate('/payment-success')
              setCurrentAmount((prev) => prev + parseInt(amount));
              handleCloseModal();
            } else {
               navigate('/payment-failed')
            }
          } catch (error) {
            console.error(error);
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name,
          email,
        },
        theme: {
          color: '#00008B',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong with payment initialization.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={cover}
          alt="Dream Porsche"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/95"></div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 space-y-24">
        {/* HERO */}
        <section className="text-center max-w-3xl space-y-6">
          <h1 className="text-6xl font-light tracking-tight leading-tight">
            A Dream 15 Years in the Making
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From childhood dreams to today’s pursuit — every small contribution fuels this journey toward the ultimate driving machine.
          </p>
        </section>

        {/* PROGRESS */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg w-full max-w-3xl p-10 space-y-6 text-center">
          <div className="flex justify-between text-gray-300 font-medium text-lg">
            <span>Raised: {formatCurrency(currentAmount)}</span>
            <span>Goal: {formatCurrency(targetAmount)}</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="h-4 bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <p className="text-gray-300 text-lg font-medium">
            {Math.round(progressPercentage)}% of dream achieved
          </p>
        </section>

        {/* STORY */}
        <section className="text-center space-y-4 max-w-2xl">
          <div className="flex justify-center space-x-8 text-lg text-gray-400 uppercase tracking-widest">
            <span>15 Years</span>
            <span>•</span>
            <span>1 Dream</span>
            <span>•</span>
            <span>Your Support</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Together, let’s turn an ordinary road into the road that leads to a dream. Every rupee, every supporter, every moment matters.
          </p>
        </section>

        {/* DONATION */}
        <section className="bg-gradient-to-b from-gray-900/80 to-black/70 border border-gray-800 rounded-2xl p-10 max-w-3xl w-full shadow-lg text-center space-y-8">
          <h3 className="text-3xl font-medium text-white">Fuel the Dream</h3>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Every contribution adds horsepower to this journey. Join the drive.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount in ₹"
              min="1"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
            />
            <button
              onClick={handleOpenModal}
              disabled={!donationAmount || donationAmount <= 0}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 px-10 py-4 rounded-lg font-semibold tracking-wide border border-red-700 hover:from-red-700 hover:to-red-900 disabled:bg-gray-700 transition-all duration-300"
            >
              Donate Now
            </button>
          </div>
        </section>

        {/* SUPPORTERS */}
        <section className="w-full max-w-3xl text-center space-y-6">
          <h4 className="text-2xl font-medium text-gray-200">Recent Supporters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {supporters.map((supporter, i) => (
              <div
                key={i}
                className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl px-6 py-4 shadow-lg flex flex-col items-center hover:bg-gray-800/70 transition-all"
              >
                <span className="text-gray-200 font-medium">{supporter.name}</span>
                <span className="text-red-400 font-semibold text-lg">+₹{supporter.amount}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-96 shadow-xl space-y-6">
              <h2 className="text-2xl font-semibold text-center text-white">
                Support the Dream 🚗
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={donationData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={donationData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
              />
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount (₹)"
                value={donationData.amount}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
              />

              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all"
              >
                Proceed to Pay
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full text-gray-400 text-sm mt-2 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
