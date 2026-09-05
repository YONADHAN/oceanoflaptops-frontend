import { axiosInstance } from "./axiosConfig";
import { toast } from "sonner";

let refreshPromise = null;

const attachRequestInterceptor = (axiosCustomInstance) => {
  axiosCustomInstance.interceptors.request.use(
    (config) => {
      if (config.url.includes("cloudinary.com")) {
        config.withCredentials = false;
        return config;
      }

      // Cookies are handled automatically by the browser with withCredentials: true
      return config;
    },
    (error) => Promise.reject(error)
  );
};

const attachResponseInterceptor = async (
  axiosCustomInstance,
  refreshEndpoint
) => {
  axiosCustomInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      //console.error("Interceptor Error:", error);
      const originalRequest = error.config;

      if (
        originalRequest &&
        (originalRequest.url.includes("/auth/user/me") || originalRequest.url.includes("/auth/admin/me")) &&
        !(error.response?.status === 401 && error.response?.data?.message === "Token is invalid or expired.")
      ) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "Token is invalid or expired." &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = axiosInstance.post(
              refreshEndpoint,
              {},
              { withCredentials: true }
            ).finally(() => {
              refreshPromise = null;
            });
          }
          await refreshPromise;

          // The backend will automatically set the new access_token cookie
          // on a successful refresh response.
          return axiosCustomInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh Token Error:", refreshError);
          if (refreshError.response && (refreshError.response.status === 401 || refreshError.response.status === 403)) {
            toast.info("Your Session has expired. Please sign in again.");
            const role = error.response?.data?.role || "user";
            switch (role) {
              case "user":
                window.location.href = "/user/signin";
                break;
              case "admin":
                window.location.href = "/admin/signin";
                break;
              default:
                window.location.href = "/";
            }
          }
          return Promise.reject(refreshError);
        }
      }

      if (
        error.response?.status === 403 &&
        error.response?.data?.message === "No token provided."
      ) {
        console.log("NO TOKEN");
        toast.info("Your session has expired. Please sign in again.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Invalide token format."
      ) {
        toast.info("Your session has expired. Please signin in again.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};

export { attachRequestInterceptor, attachResponseInterceptor };
