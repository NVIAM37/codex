import { useEffect } from 'react';
import './Footer.css';
import React from 'react';
import LOGO from './images/logo.jpg'; // Adjust the path as necessary
const Footer = () => {
  useEffect(() => {
    // Fade-in animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });

    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    sectionsToFade.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sectionsToFade.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <footer className="glass-footer fade-in-section">
      <div className="footer-container">
        <div className="footer-top">
          {/* Column 1: About & Logo */}
          <div className="footer-column footer-about">
            <a href="#">
              <img
                src={LOGO}
                alt="CODEX Logo"
                className="footer-logo-img"
              />
            </a>
            <p>Innovative software solutions and expert-led IT training designed to elevate your skills and business.</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column footer-links">
            <h4>Explore</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-column footer-links">
            <h4>Services</h4>
            <ul>
              <li><a href="/software">Software Products</a></li>
              <li><a href="/social">AIO Social Bot</a></li>
              <li><a href="/courses">IT Courses</a></li>
              <li><a href="/application">Admissions</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-column footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <i className="fas fa-phone-alt"></i>
                <a href="tel:+923330288555">+92 333 0288555</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@codex.com.pk">info@codex.com.pk</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>
                  CODEX, behind Data Medicare Center,<br />
                  Prince Town Phase 1, Qasimabad, Hyderabad
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 CODEX. All Rights Reserved of NVIAM.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
