import React, { useState, useEffect, useRef } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { wishlistService } from "../apiServices/userApiServices";

const useWishlist = (productId) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsLoading(false);
          return;
        }

        const userId = user._id;

        const response = await wishlistService.getWishlistStatus(userId, productId);
        
        if (response.status === 200) {
          setIsWishlist(response.data.isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        toast.error("Failed to check wishlist status");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      checkWishlistStatus();
    }
  }, [productId]);

  const toggleWishlist = async () => {
    if (isProcessing) return;
    
    if (!isAuthenticated || !user) {
      toast.error("Please login to manage wishlist");
      return;
    }

    setIsProcessing(true);
    
    try {
      const userId = user._id;

      const response = isWishlist
        ? await wishlistService.removeFromWishlist(userId, productId)
        : await wishlistService.addToWishlist(userId, productId);

      if (response?.status === 200 && response.data.success !== false) {
        setIsWishlist(!isWishlist);
        toast.success(
          isWishlist ? "Removed from wishlist" : "Added to wishlist"
        );
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error(
        error.response?.data?.message || 
        `Failed to ${isWishlist ? "remove from" : "add to"} wishlist`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isWishlist,
    isProcessing,
    isLoading,
    toggleWishlist
  };
};