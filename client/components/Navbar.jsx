import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LOGO from './images/logo.jpg'; // Adjust the path as necessary

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    software: false,
    trainings: false
  });
  const dropdownTimeouts = useRef({
    software: null,
    trainings: null
  });

  const handleMouseEnter = (dropdown) => {
    if (dropdownTimeouts.current[dropdown]) {
      clearTimeout(dropdownTimeouts.current[dropdown]);
    }
    setIsDropdownOpen(prev => ({ ...prev, [dropdown]: true }));
  };

  const handleMouseLeave = (dropdown) => {
    dropdownTimeouts.current[dropdown] = setTimeout(() => {
      setIsDropdownOpen(prev => ({ ...prev, [dropdown]: false }));
    }, 200); // 200ms delay
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-is-open');
    } else {
      document.body.classList.remove('menu-is-open');
    }

    return () => {
      document.body.classList.remove('menu-is-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setIsDropdownOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen({ software: false, trainings: false });
  };

  return (
    <>
      {/* Site Logo */}
      <Link to="/" className="site-logo">
        <img
          src={LOGO}
          alt="CODEX Logo"
          className="logo-image"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="chrome-navbar-container">
        <nav className="chrome-navbar">
          <div className="navbar-links">
            <Link to="/" className="nav-link">
              <i className="fas fa-home me-1"></i> Home
            </Link>
            <Link to="/about" className="nav-link">
              <i className="fas fa-info-circle me-1"></i> About
            </Link>
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                onMouseEnter={() => handleMouseEnter('software')}
                onMouseLeave={() => handleMouseLeave('software')}
              >
                <i className="fas fa-cogs me-1"></i> Software & Bots
              </button>
              <ul
                className={`dropdown-menu ${isDropdownOpen.software ? 'show' : ''}`}
                onMouseEnter={() => handleMouseEnter('software')}
                onMouseLeave={() => handleMouseLeave('software')}
              >
                <li>
                  <Link className="dropdown-item" to="/projects">
                    <i className="fas fa-project-diagram me-2"></i> Projects
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/social">
                    <i className="fab fa-linkedin me-2"></i> AIO Social Bot
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/software">
                    <i className="fas fa-laptop-code me-2"></i> Software Products
                  </Link>
                </li>
              </ul>
            </div>
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                onMouseEnter={() => handleMouseEnter('trainings')}
                onMouseLeave={() => handleMouseLeave('trainings')}
              >
                <i className="fas fa-chalkboard-teacher me-1"></i> Trainings
              </button>
              <ul
                className={`dropdown-menu ${isDropdownOpen.trainings ? 'show' : ''}`}
                onMouseEnter={() => handleMouseEnter('trainings')}
                onMouseLeave={() => handleMouseLeave('trainings')}
              >
                <li>
                  <Link className="dropdown-item" to="/courses">
                    <i className="fas fa-book-reader me-2"></i> Courses
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/application">
                    <i className="fas fa-user-graduate me-2"></i> Admissions
                  </Link>
                </li>
              </ul>
            </div>
            <Link to="/pricing" className="nav-link">
              <i className="fas fa-tags me-1"></i> Pricing
            </Link>
            <Link to="/login" className="nav-link">
              <i className="fas fa-sign-in-alt me-1"></i> Login
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        id="mobile-menu-toggle"
        className={isMenuOpen ? 'is-active' : ''}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <i className="fas fa-bars"></i>
        <i className="fas fa-times"></i>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu-overlay"
        className={isMenuOpen ? 'show' : ''}
      >
        <div className="navbar-links">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            <i className="fas fa-home me-1"></i> Home
          </Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            <i className="fas fa-info-circle me-1"></i> About
          </Link>

          <div className="mobile-dropdown-group">
            <div className={`nav-item dropdown ${isDropdownOpen.software ? 'is-open' : ''}`}>
              <button
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('software')}
              >
                <i className="fas fa-cogs me-1"></i> Software
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/projects" onClick={closeMenu}>
                    <i className="fas fa-project-diagram me-2"></i> Projects
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={closeMenu}>
                    <i className="fab fa-linkedin me-2"></i> AIO Social Bot
                  </a>
                </li>
                <li>
                  <Link className="dropdown-item" to="/software" onClick={closeMenu}>
                    <i className="fas fa-laptop-code me-2"></i> Software Products
                  </Link>
                </li>
              </ul>
            </div>
            <div className={`nav-item dropdown ${isDropdownOpen.trainings ? 'is-open' : ''}`}>
              <button
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('trainings')}
              >
                <i className="fas fa-chalkboard-teacher me-1"></i> Trainings
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/courses" onClick={closeMenu}>
                    <i className="fas fa-book-reader me-2"></i> Courses
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/application" onClick={closeMenu}>
                    <i className="fas fa-user-graduate me-2"></i> Admissions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link to="/pricing" className="nav-link" onClick={closeMenu}>
            <i className="fas fa-tags me-1"></i> Pricing
          </Link>
          <Link to="/login" className="nav-link" onClick={closeMenu}>
            <i className="fas fa-sign-in-alt me-1"></i> Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
