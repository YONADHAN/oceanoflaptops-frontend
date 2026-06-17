import { create } from "zustand";

const useWishlistStore = create((set) => ({
  wishlistCount: 0,

  setWishlistCount: (count) =>
    set({ wishlistCount: count }),

  incrementWishlist: () =>
    set((state) => ({
      wishlistCount: state.wishlistCount + 1,
    })),

  decrementWishlist: () =>
    set((state) => ({
      wishlistCount: Math.max(0, state.wishlistCount - 1),
    })),
}));

export default useWishlistStore;