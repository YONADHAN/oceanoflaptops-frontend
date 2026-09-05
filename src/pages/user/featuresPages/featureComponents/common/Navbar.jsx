


import { useState, useEffect } from "react";
import {
  Menu,

  User,
  Heart,
  ShoppingCart,
  X,

  LogOut,
  Laptop
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartCountAsync } from "../../../../../redux/slices/cartSlice";
import { fetchWishlistCountAsync } from "../../../../../redux/slices/wishlistSlice";
import { logoutUser } from "../../../../../redux/slices/authSlice";

const ModernNavbar = ({ isDarkMode, toggleTheme, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.count);
  const wishlistCount = useSelector((state) => state.wishlist.count);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCartCountAsync());
    dispatch(fetchWishlistCountAsync());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/user/signin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Shop", "Collections", "About"];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 h-[70px] flex flex-col justify-center ${scrolled
        ? isDarkMode
          ? "bg-gray-900/85 backdrop-blur-lg border-b border-gray-800"
          : "bg-white/85 backdrop-blur-lg border-b border-gray-200 shadow-sm"
        : isDarkMode
          ? "bg-gray-900/50 backdrop-blur-md"
          : "bg-white/50 backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Menu size={24} />
            </button>

            <div
              onClick={() => navigate('/')}
              className="ml-4 flex items-center space-x-2 cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isDarkMode ? "bg-white/10" : "bg-blue-100"
                  }`}
              >
                <span
                  className={`font-bold text-xl ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  <Laptop size={24} />
                </span>
              </div>

              <span
                className={`hidden lg:block text-xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Oceon<span className="text-blue-500">Of</span>Laptops
              </span>
            </div>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link}
                onClick={() => navigate(link !== "Home" ? `/${link.toLowerCase()}` : '/')}
                className={`relative font-medium text-sm tracking-wide transition-colors cursor-pointer group ${isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigate('/user/features/account')}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <User size={20} />
            </button>

            <button
              onClick={() => navigate('/user/features/wishlist')}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <div className="relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 h-4 w-4 text-xs font-bold rounded-full flex items-center justify-center ${isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => navigate('/user/features/cart')}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 h-4 w-4 text-xs font-bold rounded-full flex items-center justify-center ${isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

            {!isAuthenticated && (
              <div onClick={() => navigate('/user/signin')} className="ml-2">
                <button className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex justify-center items-center">
                  Sign In
                </button>
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className={`ml-2 p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
                  ? "text-gray-300 hover:bg-red-500/20 hover:text-red-400"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden absolute top-[70px] left-0 w-full z-40 border-b shadow-lg ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
              }`}
          >
            <div className="p-4 flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 rounded-full transition-colors ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <X size={24} />
                </button>
              </div>
              {navLinks.map((link) => (
                <div
                  key={link}
                  onClick={() => {
                    navigate(link !== "Home" ? `/${link.toLowerCase()}` : '/');
                    setIsMenuOpen(false);
                  }}
                  className={`text-lg font-medium cursor-pointer p-3 rounded-lg transition-colors ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {link}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ModernNavbar;