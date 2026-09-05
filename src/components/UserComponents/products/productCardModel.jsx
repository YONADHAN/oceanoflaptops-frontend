

import { useState, useEffect } from "react"
import { FiHeart, FiShoppingCart } from "react-icons/fi"
import { AiFillStar } from "react-icons/ai"
import { toast } from "sonner"
import { axiosInstance } from "../../../api/axiosConfig"
import { wishlistService } from "../../../apiServices/userApiServices"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useDispatch, useSelector } from "react-redux"
import { fetchCartCountAsync } from "../../../redux/slices/cartSlice"
import { fetchWishlistCountAsync } from "../../../redux/slices/wishlistSlice"
import { savePendingReturnTo } from "../../../utils/navigation/returnTo"

const ProductCard = ({ product, onProductClick, fromLandingPage = false }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [isWishlist, setIsWishlist] = useState(false)
  const [textColor, setTextColor] = useState("text-gray-600")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {

    switch (product.status) {
      case "Available":
        setTextColor("text-green-600")
        break
      case "Out of Stock":
        setTextColor("text-red-600")
        break
      case "Coming Soon":
        setTextColor("text-yellow-600")
        break
      case "Discontinued":
        setTextColor("text-red-600")
        break
      default:
        setTextColor("text-gray-600")
    }
    getWishlistStatus()
  }, [product.status])
  const navigate = useNavigate()

  const getWishlistStatus = async () => {
    if (fromLandingPage) return
    try {
      if (!isAuthenticated || !user) {
        return
      }

      const userId = user._id
      const productId = product._id

      const response = await wishlistService.getWishlistStatus(userId, productId)

      if (response.status === 200) {
        setIsWishlist(response.data.isInWishlist)
      } else {
        toast.error(response.data.message || "Unexpected response from server")
      }
    } catch (error) {
      console.error("Error getting wishlist status:", error)
      toast.error(error.response?.data?.message || "Failed to get wishlist data")
    }
  }

  const handleWishlistChange = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      if (!isAuthenticated || !user) {
        savePendingReturnTo(window.location)
        navigate('/user/signin')
        return
      }

      const userId = user._id
      const productId = product._id



      const successMessage = isWishlist ? "Removed from wishlist" : "Added to wishlist"

      let response = {}
      if (isWishlist) {
        response = await wishlistService.removeFromWishlist(userId, productId)
      } else {
        response = await wishlistService.addToWishlist(userId, productId)
      }

      if (response?.status === 200 && response.data.success !== false) {
        setIsWishlist(!isWishlist)
        toast.success(successMessage)
        dispatch(fetchWishlistCountAsync())
      } else {
        throw new Error(response.data.message || "Unexpected server response")
      }
    } catch (error) {
      console.error("Error in handleWishlistChange:", error)

      const errorMessage = isWishlist ? "Error while removing from wishlist" : "Error adding to wishlist"

      toast.error(error.response?.data?.message || errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const AddToCart = async () => {
    try {
      if (!isAuthenticated || !user) {
        savePendingReturnTo(window.location);
        navigate('/user/signin');
        return;
      }
      const response = await axiosInstance.post("/add_to_cart", {
        productId: product._id,
        quantity: 1,
      })

      if (response.status === 200) {
        toast.success("Added to cart")
        dispatch(fetchCartCountAsync())
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response

        if (status === 404) {
          toast.error("Product not found")
        } else if (status === 400) {
          toast.error(data.message || "Bad Request")
        } else {
          toast.error("Error adding to cart")
        }
      } else {
        toast.error("Network error. Please try again later.")
      }
      console.error("Error adding to cart:", error)
    }
  }

  const calculateDiscount = () => {
    if (product.regularPrice > product.salePrice) {
      const discount = ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
      return discount.toFixed(0)
    }
    return null
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <AiFillStar key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 w-full max-w-[320px] mx-auto flex flex-col h-full">
      <div className="relative bg-gray-50/50 p-4">
        <div className="overflow-hidden w-full h-[220px] flex items-center justify-center mix-blend-multiply">
          <img
            src={product.productImage[0] || "/placeholder.svg"}
            alt={product.productName}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleWishlistChange(); }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors z-10"
        >
          <FiHeart
            className={`w-5 h-5 transition-colors ${isWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
          />
        </button>
        {calculateDiscount() && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md tracking-wider">
            -{calculateDiscount()}%
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col space-y-4">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.productName}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">
            {product.description}
          </p>
          <div className="flex items-center mt-2">
            <div className="flex space-x-0.5">{renderStars(product.rating)}</div>
            <span className="text-xs font-medium text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-md">
              {Number(product.rating).toFixed(1)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-gray-900">₹{product.salePrice.toLocaleString()}</span>
              </div>
              {product.regularPrice > product.salePrice && (
                <span className="text-sm text-gray-400 line-through font-medium block mt-0.5">
                  ₹{product.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <div className={`w-1.5 h-1.5 rounded-full ${product.status === "Available" ? "bg-green-500" : product.status === "Out of Stock" ? "bg-red-500" : "bg-yellow-500"}`}></div>
                <span className={`text-[11px] font-semibold tracking-wide ${textColor}`}>
                  {product.status.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 mr-1">
                Stock: {product.quantity > 100 ? "100+" : product.quantity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => onProductClick(product._id)}
              className="w-full bg-white border border-gray-200 hover:border-gray-800 text-gray-700 hover:text-gray-900 font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); AddToCart(); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

