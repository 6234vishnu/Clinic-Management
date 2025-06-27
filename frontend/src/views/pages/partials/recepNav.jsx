import React, { useEffect, useState } from "react";
import {
  Home,
  UserPlus,
  Ticket,
  CreditCard,
  Users,
  Calendar,
  X,
  Menu,
  ClipboardCheck,
  LayoutDashboard,
} from "lucide-react";
import "../../../assets/css/partials/recepNavbar.css";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";

const RecepNav = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [recepName, setRecepName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("recepID");

  useEffect(() => {
    if (!userId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }

    const getReceptionistData = async () => {
      try {
        const response = await api.post(
          `/receptionist/getDetails?recepId=${userId}`
        );
        if (response.data.success) {
          setRecepName(response.data.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log("error in receptionist sidebar", error);
        setMessage("Server error, try again later");
      }
    };

    getReceptionistData();
  }, [userId]);

  const handleLogout = async () => {
    const recepId = localStorage.getItem("recepID");
    try {
      const response = await api.post(
        `/receptionist/logout?recepId=${recepId}`
      );
      if (response.data.success) {
        localStorage.removeItem("recepID");
        localStorage.removeItem("recepionistToken");
        navigate("/", { replace: true });

        // 3. Optional: Force refresh (clears React state, memory, etc.)
        window.location.reload();

        // 4. Clear any messages or session data if needed
        setMessage("");
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log("error in handleLogout recep Nav", error);

      setMessage("server error");
    }
  };

  const navItems = [
    { id: "home", label: "Home", path: "/", icon: <Home /> },
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/Recep-Dasboard-Page",
      icon: <LayoutDashboard />,
    },
    {
      id: "registration",
      label: "Patient Registration",
      path: "/Register-Patient",
      icon: <UserPlus />,
    },
    {
      id: "token",
      label: "Token Generation",
      path: "/Token-Generation",
      icon: <Ticket />,
    },
    {
      id: "billing",
      label: "Billing",
      path: "/Billing-receptionist",
      icon: <CreditCard />,
    },
    {
      id: "patients",
      label: "Patient List",
      path: "/Patient-List",
      icon: <Users />,
    },
    {
      id: "appointments",
      label: "Appointment Management",
      path: "/Appoinment-Shedule",
      icon: <Calendar />,
    },
    {
      id: "doctorSignupRequests",
      label: "Doctor Signup Requests",
      path: "/Approve-Doctors",
      icon: <ClipboardCheck />,
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
              alt=""
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

          <div className="recepNavUserSection">
            <div className="recepNavUserAvatar">
              <span>{recepName.charAt(0)}</span>
            </div>
            <div className="recepNavUserInfo">
              <span className="recepNavUserName">
                {recepName || "Receptionist"}
              </span>
              <span className="recepNavUserRole">Receptionist</span>
            </div>
          </div>

          {/* Logout button */}
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              padding: "10px 20px",
              border: "1px solid black",
              margin: "10px",
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            LogOut
          </button>
        </nav>
      )}

      {/* Modal */}
      {showLogoutModal && (
        <div className="logoutModalOverlay">
          <div className="logoutModalBox">
            <h5>Are you sure you want to logout?</h5>
            <div className="logoutModalButtons">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="logoutCancelBtn"
              >
                Cancel
              </button>
              <button onClick={handleLogout} className="logoutConfirmBtn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecepNav;
