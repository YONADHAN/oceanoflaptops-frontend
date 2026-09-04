// ResetPassword.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../api/axiosConfig";
import {toast} from 'sonner';
import Cookies from 'js-cookie'
import { motion } from "framer-motion";
import Breadcrumbs from '../../pages/others/commonReusableComponents/breadCrumbs';

const ResetPassword = ({linkFrom = "security",role = "user"}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      //toast.error("Invalid token")
    }
  }, [token]);

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setErrorMessage("Passwords do not match!");
      return;
    }
   

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setErrorMessage("Password must be at least 8 characters long!");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-])[A-Za-z0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>/?~`-]{8,}$/;
    if (
         !passwordRegex.test(newPassword)
      ) {
          toast.error("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return ;
      }
  
    if(linkFrom === "signin"){
      try {
      
        const response = await axiosInstance.post("/reset-password-from-signin", {
          token,
          newPassword,
        });
       
        if (response.data.success) {
          toast.success("Password reset successfully. Redirecting to login...");
          setSuccessMessage("Password reset successfully. Redirecting to login...");         
          setTimeout(() =>
            {
              if(role ==="admin") {
                navigate("/admin/signin")
              }else {
                navigate("/user/signin")
              }
            },
           3000); 
        }
      } catch (error) {
        toast.error( "Failed to reset password.");
        setErrorMessage(error.response?.data?.message || "Failed to reset password.");
      }
      return;
    }

    try {
      const response = await axiosInstance.post("/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successfully. Redirecting to login...");
        toast.success("Password reset successfully")
        Cookies.remove("access_token");
        Cookies.remove("RefreshToken");
        setTimeout(() => navigate("/user/signin"), 3000);
      }
    } catch (error) {
      toast.error(
         "Failed to reset password."
      );
      setErrorMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl mb-6">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/user/features/account' }, { label: 'Security', path: '/user/features/account/security' }, { label: 'Reset Password', path: '/user/features/account/security/reset-password' }]} />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-gray-100"
      >
        <div className="w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-12 hidden md:flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <img src="/forgetpassword.jpg" alt="Reset Password Illustration" className="max-w-full h-auto relative z-10 drop-shadow-xl rounded-2xl mix-blend-multiply" />
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Set New Password</h2>
              <p className="text-gray-500 font-medium mt-3 leading-relaxed">
                {successMessage
                  ? "Your password has been successfully reset."
                  : "Please enter your new password."}
              </p>
            </div>

            {successMessage && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-semibold border border-green-100">{successMessage}</div>}
            
            {!successMessage && (
              <form onSubmit={handleResetPassword} className="space-y-6 mt-4" noValidate>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wide"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center mt-4"
                >
                  Reset Password
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
