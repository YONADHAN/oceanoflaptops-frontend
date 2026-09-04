

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../../../../api/axiosConfig";
import { authService } from "../../../../apiServices/userApiServices";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion } from "framer-motion";
import Breadcrumbs from '../../../../pages/others/commonReusableComponents/breadCrumbs';

const PersonalInformationPage = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null,
    birthday: "",
    mobileNumber: "",
    language: "",
    gender: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState("");

  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (e?.currentTarget) {
      const { width, height } = e.currentTarget;
      const crop = centerAspectCrop(width, height, 1);
      setCrop(crop);
    }
  }

  useEffect(() => {
    initialUserData();
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  const generateBlob = async (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSaveCrop = async () => {
    try {
      setIsLoading(true);
      if (!previewCanvasRef.current) {
        throw new Error("No canvas preview available");
      }

      const blob = await generateBlob(previewCanvasRef.current);
      if (!blob) {
        throw new Error("Failed to generate blob");
      }

      const cloudinaryUrl = await uploadToCloudinary(blob);
      setFormData((prev) => ({ ...prev, profilePic: cloudinaryUrl }));
      setShowCropModal(false);
      setImgSrc("");
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error saving cropped image:", error);
      toast.error("Failed to save cropped image");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of your existing code for initialUserData, uploadToCloudinary, etc.)

  const initialUserData = async () => {
    try {
      // const token = Cookies.get('user_access_token');
      const token = Cookies.get("access_token");
      const decode = jwtDecode(token);
      const userId = decode._id;
      // const response = await axiosInstance.post("/user_details", { userId });
      const response = await authService.getUserDetails(userId);

      if (!response.data?.success) {
        toast.error("Failed to fetch user data");
        return;
      }

      const userData = response.data.user;
      setFormData({
        name: userData.username || "",
        email: userData.email || "",
        profilePic: userData.avatar || null,
        birthday: userData.birthday
          ? new Date(userData.birthday).toISOString().split("T")[0]
          : "",
        mobileNumber: userData.phone || "",
        language: userData.language || "",
        gender: userData.gender || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "Error fetching user data");
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LAPTOPHUB");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dndvg7z6d/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setLocalProfilePic(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, profilePic: cloudinaryUrl }));
      // setLocalProfilePic(null);

      toast.success("Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      // setLocalProfilePic(null);
    } finally {
      setIsLoading(false);
    }
  };
  const validation = (formData) => {
    const errors = {};
    let isValid = true;
  
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      errors.name = "Name should only contain letters and spaces";
      isValid = false;
    }
  
    // Email validation removed since it's not editable
    
    if (formData.birthday) {
      if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(formData.birthday)) {
        errors.birthday = "Please enter a valid date (YYYY-MM-DD)";
        isValid = false;
      }
      const [year, month, day] = formData.birthday.split("-");
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const m = currentDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 12) {
        errors.birthday = "You must be at least 12 years old";
        isValid = false;
      } else if (age > 100) {
        errors.birthday = "You must be at most 100 years old";
        isValid = false;
      }
    }
  
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }
  
    if (formData.language && !/^[a-zA-Z]+$/.test(formData.language)) {
      errors.language = "Language should only contain letters";
      isValid = false;
    }
  
    return { errors, isValid };
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const { errors: validationErrors, isValid } = validation(formData);
        if (!isValid) {
          setErrors(validationErrors);
          toast.error("Please fix the form errors");
          return;
        }
    
        setIsLoading(true);
        const token = Cookies.get("access_token");
        const decode = jwtDecode(token);
        const userId = decode._id;
    
        const updateData = {
          userId,
          username: formData.name.trim(),
          email: formData.email.trim(), // This will be the non-editable email
          avatar: formData.profilePic,
          birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
          phone: formData.mobileNumber.trim(),
          language: formData.language.trim(),
          gender: formData.gender,
        };
    
        //const response = await axiosInstance.post("/update_personal", updateData);
        const response = await authService.updatePersonal(updateData);
        if (response.status === 200) {
          toast.success("Profile updated successfully");
          navigate("/user/features/account/personal_info");
        } else {
          throw new Error(response.data?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.response?.data?.message || "Error updating profile");
      } finally {
        setIsLoading(false);
      }
    };
    
  
 

    const handleCancel = () => {
      initialUserData();
      toast.info("Changes cancelled");
      navigate('/user/features/account/personal_info')
      setLocalProfilePic(null);
      
     
    };

    const emailNotEditableMessage = () => {
      toast.info("Email is not editable");
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen"
      >
        {showCropModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl max-w-2xl w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Crop Profile Picture</h2>
              <div className="max-h-[60vh] overflow-auto flex justify-center bg-gray-50 rounded-xl p-4">
                {Boolean(imgSrc) && (
                  <div className="flex flex-col items-center">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                      circularCrop
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-h-[50vh] object-contain rounded-lg"
                      />
                    </ReactCrop>
                    <div className="mt-6">
                      <canvas
                        ref={previewCanvasRef}
                        className="w-[120px] h-[120px] rounded-full shadow-md ring-4 ring-white"
                        style={{
                          objectFit: "cover",
                          display: !completedCrop ? "none" : "block",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setImgSrc("");
                  }}
                  className="px-6 py-2.5 font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="px-6 py-2.5 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
                  disabled={
                    isLoading || !completedCrop?.width || !completedCrop?.height
                  }
                >
                  {isLoading ? "Saving..." : "Save Crop"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-2">
          <Breadcrumbs breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Account', path: '/user/features/account' }, { label: 'Personal Info', path: '/user/features/account/personal_info' }, { label: 'Edit', path: '/user/features/account/personal_info/edit' }]} />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Profile</h1>
          <p className="text-gray-500 mt-2">Update your personal information</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 border border-gray-100/50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left side: Avatar & Basic Info */}
            <div className="flex-1 space-y-8">
              <div className="flex flex-col items-center md:items-start pt-2">
                <div className="relative group">
                  <div className="w-40 h-40 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-[2rem] flex items-center justify-center ring-4 ring-white shadow-xl transition-all duration-300 group-hover:shadow-blue-200">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-20 h-20 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                    className="absolute -bottom-4 -right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 shadow-lg transition-all disabled:opacity-50 hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={onSelectFile} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-500 font-medium">{errors.name}</p>}
                </div>

                <div onClick={emailNotEditableMessage} className="select-none">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">Email <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">Not editable</span></label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl outline-none text-base font-semibold text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Other Info */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900 appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                />
                {errors.birthday && <p className="mt-2 text-sm text-red-500 font-medium">{errors.birthday}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                />
                {errors.mobileNumber && <p className="mt-2 text-sm text-red-500 font-medium">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-semibold transition-all text-gray-900"
                />
                {errors.language && <p className="mt-2 text-sm text-red-500 font-medium">{errors.language}</p>}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-8 py-3.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3.5 font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
export default PersonalInformationPage;
