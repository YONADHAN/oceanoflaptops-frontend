

import React, { useState, useEffect } from "react";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,

} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import GoogleButton from "../../../utils/GoogleAuth/GoogleAuthButton";
import { authService } from '../../../apiServices/userApiServices';
import { motion } from "framer-motion";

const Input = ({ icon, className, ...props }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
        {icon}
      </span>
    )}
    <input
      {...props}
      className={`w-full ${icon ? 'pl-12' : 'px-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-800 ${className || ''}`}
    />
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`w-full py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </button>
);

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = (formData) => {
    // Username validation
    if (!formData.username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if (formData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    // Check for password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-])[A-Za-z0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
    };



    // Validate form before submission
    if (!validateForm(updatedFormData)) {
      return;
    }

    setIsLoading(true);
    try {
      // const response = await axios.post(
      //   "http://localhost:3000/user_signup",
      //   formData,
      //   {
      //     withCredentials: true,
      //   }
      // );

      // const response  = await authService.signup(formData);
      const response = await authService.signup(updatedFormData);
      if (response.data.success) {
        setShowOtpModal(true);
        setTimer(120);
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Network error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    // OTP validation
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      const email = formData.email;
      // const response = await axios.post("http://localhost:3000/verify_otp", {
      //   email,
      //   otp,
      // });
      const response = await authService.verifyOtp({ email, otp });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        setShowOtpModal(false);
        navigate("/user/signin");
      }
    } catch (error) {
      toast.error(
        // error.response?.data?.message || 
        "OTP verification failed."
      );
    }
  };

  const handleResendOtp = async () => {
    if (!isResendDisabled) {
      try {
        // const response = await axios.post("http://localhost:3000/resent_otp", {
        //   email: formData.email,
        // });
        const response = await authService.resendOtp({ email: formData.email });

        if (response.data.success) {
          toast.info("OTP has been sent to your mobile phone. Please verify.");
          setTimer(120);
          setIsResendDisabled(true);
          setOtp(""); // Clear previous OTP
        } else {
          toast.error(response.data.message || "Failed to resend OTP");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Network error occurred."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900 text-center md:text-left">
            Create Your Account
          </h1>
          <p className="mb-8 text-gray-500 text-center md:text-left">Join us and start exploring premium laptops.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              icon={<FaUser />}
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              icon={<FaEnvelope />}
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="relative">
              <Input
                icon={<FaLock />}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors z-10"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <Input
              icon={<FaPhone />}
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 mt-2"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <div className="my-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200">
            <span className="mx-4 text-center text-sm font-semibold text-gray-400">
              OR
            </span>
          </div>

          <div className="w-full flex justify-center mb-6">
            <GoogleButton role="user" isDarkMode={false} />
          </div>

          <p className="text-center text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <a
              href="/user/signin"
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              Log in
            </a>
          </p>
        </div>

        {/* Right side Image */}
        <div className="w-full md:w-1/2 relative overflow-hidden hidden md:block bg-gray-900">
          <img
            src="/images/auth_laptop_hardware_1788446393250.png"
            alt="Latest Laptop Models"
            className="absolute inset-0 w-full h-full object-cover opacity-70 transition duration-700 ease-in-out transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/20 pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 text-white pr-8 z-10">
            <h2 className="text-3xl font-bold mb-2">
              Discover Amazing Laptops
            </h2>
            <p className="text-blue-100 text-lg">
              Sign up now to explore our wide range of high-performance
              workstations and ultra-books!
            </p>
          </div>
        </div>
      </motion.div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <FaEnvelope size={24} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">We've sent a verification code to your email/phone.</p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <Input
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-widest text-xl font-bold"
              />
              <p className="text-center text-sm font-semibold text-gray-700">
                Time remaining: <span className="text-blue-600">{Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}{timer % 60}</span>
              </p>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Verify Code
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Didn't receive the code? </span>
              <button
                className={`font-semibold ${isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800 transition-colors"
                  }`}
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                type="button"
              >
                Resend OTP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Signup;