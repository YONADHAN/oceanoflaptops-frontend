import React, { useState, useEffect, useRef } from "react";
import { Minus, Plus, ChevronRight, ShoppingCart } from "lucide-react";
import { FiHeart } from "react-icons/fi";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  productService,
  cartService,
  wishlistService,
} from "../../../apiServices/userApiServices";
import { axiosInstance } from "../../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartCountAsync } from "../../../redux/slices/cartSlice";
import { fetchWishlistCountAsync } from "../../../redux/slices/wishlistSlice";
import { savePendingReturnTo } from "../../../utils/navigation/returnTo";

const ProductDetailPage = ({ productId }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product details using the service
        const response = await productService.getProductDetails(productId);

        if (!response || !response.data.success) {
          throw new Error(response?.data?.message || "Failed to fetch product");
        }

        setProduct(response.data.productDetails);
        //console.log("Product details", response.data.productDetails);
      } catch (err) {
        const status = err.response?.status;
        const errorMessage =
          err.response?.data?.message || "Failed to fetch product";

        // Handle different status codes for better UX
        switch (status) {
          case 403: // Forbidden
            toast.error(errorMessage || "Access forbidden");
            navigate("/");
            break;
          case 404: // Not found
            toast.error("Product details not found");
            navigate("/");
            break;
          case 400: // Bad request
            toast.error("Invalid product ID");
            break;
          case 500: // Server error
            toast.error("An internal server error occurred");
            break;
          default:
            toast.error(errorMessage);
        }

        setError(errorMessage);
      } finally {
        setLoading(false);

      }
    };

    fetchProduct();
  }, [productId, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (product?._id) {
      getWishlistStatus();
    }
  }, [product]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!product) return null;

  const handleQuantityChange = async (action) => {
    try {
      if (!isAuthenticated) {
        savePendingReturnTo(window.location);
        navigate('/user/signin');
        return;
      }
      const response = await axiosInstance.post("get_quantity", {
        productId: product._id,
      });

      if (!response || !response.data.success) {
        toast.error(
          response?.data?.message || "Unable to fetch stock information."
        );
        return;
      }

      const quantityInfoFromBackend = response.data.quantity;

      if (
        quantity < quantityInfoFromBackend ||
        (quantity === quantityInfoFromBackend && action === "decrease")
      ) {
        if (action === "increase") {
          if (quantity === 5) {
            toast.error("Maximum quantity allowed per order is 5.");
            return;
          }
          setQuantity((prev) => prev + 1);
        } else if (action === "decrease" && quantity > 1) {
          if (quantity === 1) {
            toast.error("Minimum quantity is 1.");
            return;
          }
          setQuantity((prev) => prev - 1);
        }
      } else {
        toast.error("Cannot exceed available stock.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update quantity. Please try again.";
      toast.error(errorMessage);

      if (error.response?.status === 403) {
        navigate("/");
      }

      console.error("Error handling quantity change:", error);
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomPosition({ x, y });
    }
  };

  const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        savePendingReturnTo(window.location);
        navigate('/user/signin');
        return;
      }
      const productId = product._id;
      const response = await cartService.addToCart(productId, quantity);

      if (!response || !response.data.success) {
        toast.error(
          response?.data?.message || "Failed to add product to cart."
        );
        return;
      }

      dispatch(fetchCartCountAsync());
      toast.success("Product added to cart successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";

      switch (err.response?.status) {
        case 400:
          toast.error(errorMessage);
          navigate("/");
          break;
        case 401:
          toast.error(
            "You are not authorized. Please log in again. If the problem still exists, please logout and login again."
          );

          break;
        case 404:
          toast.error("Product not found. It may have been removed.");
          navigate("/");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(errorMessage);
      }

      console.error("Error adding to cart:", err);
    }
  };



  const getWishlistStatus = async () => {
    try {
      if (!isAuthenticated || !user) {
        return;
      }

      const userId = user._id;
      const productId = product._id;

      //const response = await axiosInstance.post(`/check_if_in_wishlist`, { userId, productId });
      const response = await wishlistService.getWishlistStatus(
        userId,
        productId
      );

      if (response.status === 200) {
        setIsWishlist(response.data.isInWishlist);
      } else {
        toast.error(response.data.message || "Unexpected response from server");
      }
    } catch (error) {
      console.error("Error getting wishlist status:", error);
      toast.error(
        error.response?.data?.message || "Failed to get wishlist data"
      );
    }
  };

  const handleWishlistChange = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!isAuthenticated || !user) {
        savePendingReturnTo(window.location);
        navigate('/user/signin');
        return;
      }

      const userId = user._id;
      const productId = product._id;

      console.log("Product ID:", productId);
      console.log("User ID:", userId);

      const successMessage = isWishlist
        ? "Removed from wishlist"
        : "Added to wishlist";

      let response = {};
      if (isWishlist) {
        response = await wishlistService.removeFromWishlist(userId, productId);
      } else {
        response = await wishlistService.addToWishlist(userId, productId);
      }

      if (response?.status === 200 && response.data.success !== false) {
        setIsWishlist(!isWishlist);
        toast.success(successMessage);
        dispatch(fetchWishlistCountAsync());
      } else {
        throw new Error(response.data.message || "Unexpected server response");
      }
    } catch (error) {
      console.error("Error in handleWishlistChange:", error);

      const errorMessage = isWishlist
        ? "Error while removing from wishlist"
        : "Error adding to wishlist";

      toast.error(error.response?.data?.message || errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <ChevronRight className="w-4 h-4" />
        <a href="/shop" className="hover:text-primary">
          Shop
        </a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-500">{product.productName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4 lg:relative lg:z-50">
          <div className="relative">
            <div
              className="relative aspect-square overflow-hidden cursor-zoom-in "
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              ref={imageRef}
            >
              <img
                src={product.productImage[currentImage]}
                alt={product.productName}
                className="w-full h-full object-contain rounded-lg"
              />
              <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                <FiHeart
                  onClick={handleWishlistChange}
                  className={`w-5 h-5 ${isWishlist ? "fill-red-700 text-red-700" : "text-gray-600"
                    }`}
                />
              </button>
            </div>
            {isZoomed && (
              <div className="hidden md:block absolute top-16 left-full ml-4 w-[500px] h-[450px] rounded-lg shadow-2xl bg-white overflow-hidden z-50">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${product.productImage[currentImage]})`,
                    backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100
                      }%`,
                    backgroundSize: "400%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.productImage.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${currentImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
              >
                <img
                  src={imageUrl}
                  alt={`${product.productName} - ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              {product.productName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700">Brand: {product.brand}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700">Model: {product.modelNumber}</span>
              <div className="flex items-center space-x-1.5 border border-gray-200 bg-white shadow-sm px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${product.status === "Available" ? "bg-green-500" : product.status === "Out of Stock" ? "bg-red-500" : "bg-yellow-500"}`}></div>
                <span className={`font-semibold ${product.status === "Available" ? "text-green-600" : "text-red-600"}`}>
                  {product.status.toUpperCase()} ({product.quantity} in stock)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline space-x-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
            <span className="text-4xl font-black text-gray-900 tracking-tight">
              {indianCurrencyFormatter.format(Number(product.salePrice).toFixed(0)).replace(".00", "")}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xl text-gray-400 line-through font-medium">
                {indianCurrencyFormatter.format((product.regularPrice).toFixed(0)).replace(".00", "")}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-base">
            {product.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-[52px]">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-4 h-full text-gray-500 hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-12 text-center font-bold text-gray-900 text-lg">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-4 h-full text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-[52px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-lg tracking-wide">Add to Cart</span>
            </button>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Processor", value: `${product.processor.brand} ${product.processor.model} ${product.processor.generation}` },
                { label: "RAM", value: `${product.ram.size} ${product.ram.type}` },
                { label: "Storage", value: `${product.storage.type} ${product.storage.capacity}` },
                { label: "Graphics", value: `${product.graphics.model} (${product.graphics.vram})` },
                { label: "Display", value: `${product.display.size} - ${product.display.resolution} (${product.display.refreshRate}Hz)` },
                { label: "Operating System", value: product.operatingSystem },
                { label: "Battery Life", value: `${product.batteryLife} hours` },
                { label: "Weight", value: `${product.weight} kg` },
                { label: "Ports", value: product.ports },
                { label: "Product Category", value: product.category.name }
              ].map((spec, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 px-6 py-4 hover:bg-blue-50/50 transition-colors">
                  <div className="text-sm font-semibold text-gray-500">{spec.label}</div>
                  <div className="text-sm text-gray-900 md:col-span-2 font-medium">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
