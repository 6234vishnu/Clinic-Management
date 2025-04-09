// NavigationBar.jsx
import React, { useEffect, useState } from 'react';
import { Home, UserPlus, Ticket, CreditCard, Users, Calendar, X, Menu,ClipboardCheck } from 'lucide-react';
import '../../../assets/css/partials/recepNavbar.css';
import api from '../../../services/axios';
import { useNavigate } from 'react-router-dom';

const RecepNav = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(true);
  const [message,setMessage]=useState("")
  const [recepName,setRecepName]=useState("")
  const navigate=useNavigate()

  
  
  const userId=localStorage.getItem("recepID")
  useEffect(() => {
    if (!userId) {
      setMessage("Couldn't find any user. Please log in first.");
      return;
    }
  
    const getReceptionistData = async () => {
      try {
        const response = await api.post(`/receptionist/getDetails?recepId=${userId}`);
        if (response.data.success) {
          setRecepName(response.data.name);
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log('error in receptionist sidebar', error);
        setMessage('Server error, try again later');
      }
    };
  
    getReceptionistData();
  }, [userId]);
  

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',path:"", icon: <Home /> },
    { id: 'registration', label: 'Patient Registration',path:"", icon: <UserPlus /> },
    { id: 'token', label: 'Token Generation',path:"", icon: <Ticket /> },
    { id: 'billing', label: 'Billing',path:"", icon: <CreditCard /> },
    { id: 'patients', label: 'Patient List',path:"", icon: <Users /> },
    { id: 'appointments', label: 'Appointment Management',path:"", icon: <Calendar /> },
    { id: 'doctorSignupRequests', label: 'Doctor Signup Requests',path:"/Approve-Doctors", icon: <ClipboardCheck /> } 
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
            <img style={{width:"90px",height:"60px",marginLeft:"83px",borderRadius:"30px"}} src="\src\assets\images\LogoImage.jpg" alt="" />
          </div>

          <ul className="recepNavList">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`recepNavItem ${activeItem === item.label ? 'recepNavItemActive' : ''}`}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path); 
                }}
              >
                <div className="recepNavIconContainer">
                  {item.icon}
                </div>
                <span className="recepNavLabel">{item.label}</span>
                {activeItem === item.label && <div className="recepNavActiveIndicator" />}
              </li>
            ))}
          </ul>

          <div className="recepNavUserSection">
            <div className="recepNavUserAvatar">
              <span>JD</span>
            </div>
            <div className="recepNavUserInfo">
            <span className="recepNavUserName">{recepName || 'Receptionist'}</span>
              <span className="recepNavUserRole">Receptionist</span>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default RecepNav;
