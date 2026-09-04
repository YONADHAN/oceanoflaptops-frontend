import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { authService } from '../../../../apiServices/userApiServices'
import ConfirmationAlert from '../../../../components/MainComponents/ConformationAlert';
import { motion } from "framer-motion";
import Breadcrumbs from '../../../../pages/others/commonReusableComponents/breadCrumbs';

import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaPencilAlt,
  FaKey,
  FaShoppingBag,
  FaWallet,
  FaCalendar,
  FaGlobe,
  FaUser,
} from "react-icons/fa";

const AccountPersonalInformation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditPageAlert, setShowEditPageAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setShowEditPageAlert(false);

  };
  const goToForgotPasswordPage = () => {
    // navigate('/user/features/account/personal_info/forget_password')
    navigate('/user/features/account/security/change-password')
  }

  const goToEditProfilePage = () => {
    setShowEditPageAlert(false);
    navigate("/user/features/account/personal_info/edit");
  };

  const fetchData = async () => {
    try {
      // const token = Cookies.get("user_access_token");
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }
      const decoded = jwt_decode(token);
      const userId = decoded._id;
      // const personalData = await axiosInstance.post("/user_details", { userId });
      const personalData = await authService.getUserDetails(userId);
      if (!personalData) {
        toast.error("Failed to fetch user's data");
        return;
      }
      setData(personalData.data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="group p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-1.5">
        <Icon size={12} className="text-blue-500" />
        {label}
      </div>
      <p className="text-lg font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, title, desc, onClick }) => (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-6 rounded-[1.5rem] bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-left group w-full"
    >
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md text-blue-600 mb-4 transition-all">
        <Icon size={20} />
      </div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 font-medium">{desc}</p>
    </motion.button>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-[2.5rem]"></div>
        <div className="h-96 w-full bg-gray-200 animate-pulse rounded-[2rem]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen"
    >
      <div className="mb-2">
        <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/user/features/account' }, { label: 'Personal Info', path: '/user/features/account/personal_info' }]} />
      </div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your personal information and preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEditPageAlert(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-200"
        >
          <FaPencilAlt size={14} />
          Edit Profile
        </motion.button>
      </div>

      {/* Main Profile Info */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 border border-gray-100/50 overflow-hidden p-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-[2rem] flex items-center justify-center ring-4 ring-white shadow-xl transition-all duration-300 group-hover:shadow-blue-200">
                {data?.avatar ? (
                  <img src={data?.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle size={80} className="text-blue-300" />
                )}
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">{data?.username}</h3>
            <p className="text-blue-600 font-medium">{data?.email}</p>
          </div>

          <div className="flex-grow bg-gray-50/50 rounded-[1.5rem] p-6 sm:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem icon={FaUser} label="Name" value={data?.username} />
              <InfoItem icon={FaPhone} label="Phone" value={data?.phone} />
              <InfoItem icon={FaEnvelope} label="Email" value={data?.email} />
              {data?.birthday && <InfoItem icon={FaCalendar} label="Birthday" value={data?.birthday.slice(0, 10) ? formatDate(data?.birthday.slice(0, 10)) : ""} />}
              {data?.language && <InfoItem icon={FaGlobe} label="Language" value={data?.language} />}
              {data?.gender && <InfoItem icon={FaUser} label="Gender" value={data?.gender} />}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 border border-gray-100/50 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickActionButton
            icon={FaShoppingBag}
            title="Order History"
            desc="View your past orders"
            onClick={() => navigate("/user/features/order")}
          />
          <QuickActionButton
            icon={FaWallet}
            title="My Wallet"
            desc="Manage your funds"
            onClick={() => navigate("/user/features/wallet")}
          />
          <QuickActionButton
            icon={FaKey}
            title="Security"
            desc="Change your password"
            onClick={goToForgotPasswordPage}
          />
        </div>
      </div>

      <ConfirmationAlert
        show={showEditPageAlert}
        title="Edit Profile"
        message="Are you sure you want to edit your profile?"
        onCancel={handleCancel}
        onProceed={goToEditProfilePage}
        noText="No"
        yesText="Yes"
      />
    </motion.div>
  );
};

export default AccountPersonalInformation;
