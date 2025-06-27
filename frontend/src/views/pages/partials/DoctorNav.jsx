// DoctorNav.jsx
import React, { useEffect, useState } from "react";
import {
  Home,
  CreditCard,
  Users,
  X,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import "../../../assets/css/partials/recepNavbar.css";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";

const DoctorNav = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [docName, setDocName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("docId");

  useEffect(() => {
    if (!userId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }

    const getReceptionistData = async () => {
      try {
        const response = await api.post(`/doctor/getDetails?docId=${userId}`);
        if (response.data.success) {
          setDocName(response.data.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log("error in doctor sidebar", error);
        setMessage("Server error, try again later");
      }
    };

    getReceptionistData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      const response = await api.post(`/doctor/logout?docId=${userId}`);
      if (response.data.success) {
        localStorage.removeItem("docId");
        localStorage.removeItem("doctorToken");
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Logout error:", error);
      setMessage("Server error");
    }
  };

  const navItems = [
    { id: "home", label: "Home", path: "/", icon: <Home /> },
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/Doctor-Dashboard-Page",
      icon: <LayoutDashboard />,
    },
    {
      id: "Medical History Page",
      label: "Medical History Page",
      path: "/Medical-History-Doctor",
      icon: <CreditCard />,
    },
    {
      id: "Patient Consultation Page",
      label: "Patient Consultation Page",
      path: "/Patient-Consultation-Page",
      icon: <Users />,
    },
    {
      id: "View Patient Records and Profile",
      label: "Search Patient Records",
      path: "/Patient-List-Page",
      icon: <Users />,
    },
  ];

  return (
    <>
      <button
        className="recepNavToggleBtn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <nav className="recepNavContainer">
          <div className="recepNavLogo">
            <img
              style={{
                width: "90px",
                height: "60px",
                marginLeft: "83px",
                borderRadius: "30px",
              }}
              src="\src\assets\images\LogoImage.jpg"
              alt="logo"
            />
          </div>

          <ul className="recepNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`recepNavItem ${
                  activeItem === item.label ? "recepNavItemActive" : ""
                }`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
              >
                <div className="recepNavIconContainer">{item.icon}</div>
                <span className="recepNavLabel">{item.label}</span>
                {activeItem === item.label && (
                  <div className="recepNavActiveIndicator" />
                )}
              </li>
            ))}
          </ul>

          <button
            className="doctorLogoutBtn"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>

          <div className="recepNavUserSection">
            <div className="recepNavUserAvatar">
              <span>{docName.charAt(0)}</span>
            </div>
            <div className="recepNavUserInfo">
              <span className="recepNavUserName">{docName || "doctor"}</span>
              <span className="recepNavUserRole">Doctor</span>
            </div>
          </div>
        </nav>
      )}

      {showLogoutModal && (
        <div className="logoutModalOverlay">
          <div className="logoutModalContent">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logoutModalActions">
              <button className="logoutConfirmBtn" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button
                className="logoutCancelBtn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorNav;
