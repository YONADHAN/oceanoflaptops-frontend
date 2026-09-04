import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Laptop } from "lucide-react";
// import axios from 'axios';
import { axiosInstance } from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import GoogleButton from "../../../utils/GoogleAuth/GoogleAuthButton";
import { authService } from "../../../apiServices/userApiServices";
import { motion } from "framer-motion";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email.trim() && !password.trim()) {
        toast.error("Email and password are required");
        return;
      }
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!password.trim()) {
        toast.error("Password is required");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (!password.trim()) {
        toast.error("Password is required.");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-])[A-Za-z0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-]{8,}$/;

      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must include uppercase, lowercase, number, and special character."
        );
        return;
      }

      const response = await authService.signin({
        email: email.toLowerCase().trim(),
        password,
      });
      if (response.status === 200) {
        // console.log(response.data);
        const { accessToken, message } = response.data;
        // console.log("user_access_token is :", accessToken);
        // console.log("Sign-in successful:", message);
        toast.success("Sign-in successful");

        Cookies.set("access_token", accessToken, {
          expires: 45 / 1440,
          secure: false,
          sameSite: "Strict",
          // path: ''
        });

        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error:", error.message);
        toast.error(error.message);
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google");
  };
  const forgetPasswordEmail = async () => {
    navigate("/user/verify-email-signin");
  };

  const goSignup = () => {
    navigate("/user/signup");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row w-full md:w-4/5 lg:w-3/4 max-w-5xl"
      >
        {/* Left side: Image */}
        <div className="w-full lg:w-1/2 hidden lg:block relative bg-gray-900">
          <img
            src="/images/auth_laptop_desk_1788446313829.png"
            alt="Sign In"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/20 pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 text-white z-10 pr-8">
            <h3 className="text-3xl font-bold mb-2">Welcome Back.</h3>
            <p className="text-blue-100 text-lg">Sign in to access your premium laptop deals and personalized experience.</p>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Laptop className="text-blue-600" size={24} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center lg:text-left">Sign In</h2>
          <p className="mb-8 text-gray-500 text-center lg:text-left">You've been missed! Let's get you signed in.</p>
          
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                onClick={forgetPasswordEmail}
              >
                Forgot password?
              </button>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
              type="submit"
            >
              Log In
            </button>
          </form>

          <div className="my-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200">
            <p className="mx-4 mb-0 text-center font-semibold text-gray-400 text-sm">
              OR
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <GoogleButton role="user" />
          </div>

          <p className="text-gray-600 mt-4 text-center text-sm font-medium">
            Don't have an account?{" "}
            <button
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
              onClick={goSignup}
            >
              Create one now
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
