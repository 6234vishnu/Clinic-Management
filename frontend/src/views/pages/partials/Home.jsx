import React, { useState } from "react";
import {
  Menu,
  X,
  Calendar,
  Users,
  FileText,
  Shield,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import "../../../assets/css/partials/ClinicHomepage.css";
import { useNavigate } from "react-router-dom";
import RecepNav from "./recepNav";

const ClinicHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const recepId = localStorage.getItem("recepID");

  return (
    <>
      {recepId && <RecepNav />}
      <div className="homepage">
        {/* Navigation */}
        {!recepId && (
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-content">
                {/* Desktop Navigation */}
                <div className="desktop-nav">
                  <div className="auth-buttons">
                    <button
                      className="login-btn"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                    <button
                      className="profile-btn"
                      onClick={() => navigate("/Recep-Dasboard-Page")}
                    >
                      Dashboard
                    </button>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="mobile-menu-btn">
                  <button
                    onClick={toggleMenu}
                    className="menu-toggle"
                    style={{ color: "white", marginLeft: "250px" }}
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="mobile-nav">
                <div className="mobile-nav-content">
                  <a href="#home" className="mobile-nav-link">
                    Home
                  </a>
                  <a href="#services" className="mobile-nav-link">
                    Services
                  </a>
                  <a href="#about" className="mobile-nav-link">
                    About
                  </a>
                  <a href="#contact" className="mobile-nav-link">
                    Contact
                  </a>
                  <div className="mobile-auth-buttons">
                    <button className="mobile-login-btn">Login</button>
                    <button className="mobile-profile-btn">Profile</button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        )}

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Modern
                  <span className="hero-highlight"> Healthcare</span>
                  <br />
                  Management
                </h1>
                <p className="hero-description">
                  Streamline your clinic operations with our comprehensive
                  management system. Efficient patient care, seamless
                  scheduling, and digital records all in one place.
                </p>
              </div>
              <div className="hero-image">
                <div className="image-placeholder"></div>
                <div className="floating-element-1"></div>
                <div className="floating-element-2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h2 className="section-title">Comprehensive Clinic Management</h2>
              <p className="section-description">
                Everything you need to run your clinic efficiently and provide
                exceptional patient care
              </p>
            </div>

            <div className="features-grid">
              {[
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description:
                    "Automated appointment booking with conflict detection and patient notifications",
                },
                {
                  icon: Users,
                  title: "Patient Management",
                  description:
                    "Comprehensive patient profiles with medical history and treatment records",
                },
                {
                  icon: FileText,
                  title: "Digital Records",
                  description:
                    "Secure, paperless documentation with easy search and retrieval",
                },
                {
                  icon: Shield,
                  title: "HIPAA Compliant",
                  description:
                    "Enterprise-grade security ensuring patient data privacy and compliance",
                },
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-container">
            <div className="about-content">
              <div className="about-image">
                <div className="about-placeholder"></div>
              </div>
              <div className="about-text">
                <h2 className="section-title">
                  Trusted by Healthcare Professionals
                </h2>
                <p className="about-description">
                  Our clinic management system has been designed by healthcare
                  professionals for healthcare professionals. We understand the
                  unique challenges of modern medical practice and have created
                  a solution that adapts to your workflow.
                </p>
                <div className="stats-grid">
                  {[
                    { number: "1000+", label: "Clinics Using" },
                    { number: "50K+", label: "Patients Managed" },
                    { number: "99.9%", label: "Uptime" },
                    { number: "24/7", label: "Support" },
                  ].map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h2 className="section-title">What Our Users Say</h2>
            </div>
            <div className="testimonials-grid">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Pediatrician",
                  content:
                    "This system has revolutionized how we manage our clinic. The scheduling feature alone has saved us hours every week.",
                },
                {
                  name: "Michael Chen",
                  role: "Clinic Administrator",
                  content:
                    "The patient management tools are incredibly intuitive. Our staff adapted quickly and patient satisfaction has improved significantly.",
                },
                {
                  name: "Dr. Emily Rodriguez",
                  role: "Family Medicine",
                  content:
                    "HIPAA compliance was our biggest concern, but this platform exceeded all our security requirements while being user-friendly.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star-icon" size={20} />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <span className="avatar-text">{testimonial.name[0]}</span>
                    </div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-icon">
                    <span className="footer-logo-text">+</span>
                  </div>
                  <span className="footer-brand-name">MediCare</span>
                </div>
                <p className="footer-description">
                  Empowering healthcare professionals with modern clinic
                  management solutions.
                </p>
              </div>
              <div className="footer-section">
                <h4 className="footer-title">Product</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#" className="footer-link">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Updates
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h4 className="footer-title">Support</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#" className="footer-link">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Training
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer-section">
                <h4 className="footer-title">Company</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#" className="footer-link">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copyright">
                &copy; 2025 MediCare. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ClinicHomepage;
