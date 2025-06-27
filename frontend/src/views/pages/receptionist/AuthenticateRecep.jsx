import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";

function AuthenticateReceptionist() {
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const recepId=localStorage.getItem("recepID")
  const navigate=useNavigate()
  if(!recepId) return navigate("/login")

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.post(`/receptionist/getDetails?recepId=${recepId}`);
        if (response.data.success) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) return null;

  return userExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthenticateReceptionist;
