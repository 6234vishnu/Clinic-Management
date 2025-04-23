import axios from 'axios'

const backendURL=import.meta.env.VITE_BACKEND_URL
const api=axios.create({
    baseURL:backendURL
})

api.defaults.withCredentials=true

api.interceptors.request.use(
    async (config) => {
      const token =
        localStorage.getItem("doctorToken") || localStorage.getItem("recepionistToken");
  
        
      const allowedRoutes = [
        "/doctor/auth/doctor-login",
        "/receptionist/auth/recep-login",
        "/doctor/auth/verifyOtp",
        "/receptionist/auth/verifyOtp",
        "/doctor/auth/getOtp",
        "/receptionist/auth/getOtp",
        "/doctor/resendOtp",
        "/receptionist/resendOtp",
        "/doctor/auth/newPassword",
        "/receptionist/auth/newPassword",
        "/user/logout",
        "/admin/auth/Admin-Login",
      ];
  
      if (config.url && allowedRoutes.includes(config.url)) {
        return config;
      }
  
      if (!token) {
        const currentRoute = window.location.pathname;
  
        // Redirection for admin and user routes
        if (currentRoute.includes("/doctor")) {
          window.location.href = "/";
        } else if (currentRoute.includes("/receptionist")) {
          window.location.href = "/";
        }
  
        // Reject the request since there's no token
        return Promise.reject(
          new Error("No token available, redirecting to login.")
        );
      }
  
      // If token exists, add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api
