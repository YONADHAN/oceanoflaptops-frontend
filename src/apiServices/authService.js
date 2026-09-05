import { axiosInstance } from '../api/axiosConfig';

export const authService = {
  logout: async (userId) => {
    if (!userId) {
      console.warn("Logout requested without userId; server-side logout is not possible because the backend endpoint requires the user ID.");
      return;
    }
    return await axiosInstance.delete(`/auth/refresh-token/${userId}`);
  }
};
