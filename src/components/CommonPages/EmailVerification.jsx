




import React, { useState } from "react";
import { axiosInstance } from "../../api/axiosConfig";
import { authService } from "../../apiServices/adminApiServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Breadcrumbs from '../../pages/others/commonReusableComponents/breadCrumbs';

const EmailVerification = ({ linkFrom = "security", role = "user" }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); //  Loading state added
  const navigate = useNavigate();

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true); //  Start loading
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const email = formData.get("email").toLowerCase();

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false); // ❌ Stop loading if validation fails
      return;
    }

    try {
      let link = "";
      if (linkFrom === "signin") {
        link = role === "admin" ? "/admin/request-password-reset-from-signin" : "/request-password-reset-from-signin";
        const response = await axiosInstance.post(link, { email });

        if (response.data.success) {
          setSuccessMessage("A verification email has been sent. Please check your inbox.");
          toast.success("Verification email sent.");
        }
      } else {
        const data = { email };

        const response = await authService.requestPasswordReset(data);
        if (response.data.success) {
          setSuccessMessage("A verification email has been sent. Please check your inbox.");
          toast.success("Verification email sent.");
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Email verification failed.");
      toast.error("Email verification failed.");
    } finally {
      setLoading(false); //  Stop loading after API call
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl mb-6">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/user/features/account' }, { label: 'Security', path: '/user/features/account/security' }, { label: 'Verify Email', path: '/user/features/account/security/verify-email' }]} />
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Verify Email</h2>
              <p className="text-gray-500 font-medium mt-3 leading-relaxed">
                Please enter your registered email address to verify your account and proceed.
              </p>
            </div>

            {errorMessage && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">{errorMessage}</div>}
            {successMessage && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-semibold border border-green-100">{successMessage}</div>}

            <form onSubmit={handleEmailVerification} className="space-y-6 mt-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900 placeholder-gray-400"
                  required
                  disabled={loading} //  Disable input when loading
                />
              </div>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                disabled={loading} //  Disable button when loading
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Verify Email"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
