import React from 'react';
import AddressForm from './AccountAddressManagementAddressForm';
import {axiosInstance} from '../../../../api/axiosConfig';
import {authService} from '../../../../apiServices/userApiServices'
import { useSelector } from 'react-redux';
import {toast} from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddAddress = ({ redirectToCheckout = false, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleAddAddress = async (newAddress) => {
    try {
      if (!isAuthenticated || !user) return;
      const userId = user._id;

      const response = await authService.addAddress(newAddress, userId);

      if (response?.status === 200 || response?.status === 201) {
        toast.success('Address added successfully');
        //console.log('Address added successfully');
        if (onSuccess) onSuccess();
        navigate(redirectToCheckout ? '/user/features/cart/checkout' : '/user/features/account/addresses');
      }
      
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      setTimeout(() => navigate('/user/features/account/addresses'), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Address</h1>
      <AddressForm onSubmit={handleAddAddress} />
    </div>
  );
};

export default AddAddress;
