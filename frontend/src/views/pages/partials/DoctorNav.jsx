// NavigationBar.jsx
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
} from "lucide-react";
import "../../../assets/css/partials/recepNavbar.css";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";

const DoctorNav = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [docName, setDocName] = useState("");
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

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/Doctor-Dashboard-Page",
      icon: <Home />,
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
              <span>{docName.charAt(0)}</span>
            </div>
            <div className="recepNavUserInfo">
              <span className="recepNavUserName">{docName || "doctor"}</span>
              <span className="recepNavUserRole">Doctor</span>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default DoctorNav;
