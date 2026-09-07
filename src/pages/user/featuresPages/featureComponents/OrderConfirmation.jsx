"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../../../../api/axiosConfig"
import Confetti from "react-confetti"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag, ListOrdered } from "lucide-react"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [showConfetti, setShowConfetti] = useState(true)

  const handleContinueShopping = () => {
    navigate("/shop")
  }

  const goToOrder = () => {
    navigate("/user/features/order")
  }

  const clearCart = () => {
    const clear = axiosInstance.post("clear_cart")
    if (clear.status === "200") {
      //console.log("Cart cleared successfully")
    } else {
      //console.log("Failed to clear cart")
    }
  }

  useEffect(() => {
    clearCart()

    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)

    const timer = setTimeout(() => setShowConfetti(false), 6000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          wind={0.01}
          tweenDuration={3000}
          colors={['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-white/60 p-10 sm:p-12 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-inner border border-green-100"
          >
            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2} />
          </motion.div>

          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-3">
            Order Confirmed!
          </h2>
          <p className="text-center text-slate-500 mb-8 max-w-sm leading-relaxed">
            Thank you for your purchase. We're processing your order and will send an email with the tracking information shortly.
          </p>

          <div className="w-full bg-slate-50/80 rounded-2xl p-5 border border-slate-100 mb-8 backdrop-blur-sm">
            <p className="text-xs text-slate-400 text-center uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
            <p className="text-center text-lg font-mono font-bold text-indigo-600 tracking-wide break-all">
              {orderId}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleContinueShopping}
              className="flex-1 group relative flex items-center justify-center gap-2 py-3.5 px-4 border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100 transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              Keep Shopping
            </button>
            <button
              onClick={goToOrder}
              className="flex-1 group relative flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <ListOrdered className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
              View Order Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderConfirmation
