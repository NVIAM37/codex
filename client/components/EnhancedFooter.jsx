import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './EnhancedFooter.css';
import LOGO from './images/logo.jpg';

const EnhancedFooter = ({ hideBg }) => {
    return (
        <footer className="enhanced-footer">
            {!hideBg && <div className="footer-bg-glow"></div>}
            <div className="footer-content-container">
                <div className="footer-grid">
                    {/* Column 1: Brand & About */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="footer-col"
                    >
                        <Link to="/" className="footer-logo">
                            <img src={LOGO} alt="CODEX Logo" />
                            <span>CODEX</span>
                        </Link>
                        <p className="footer-desc">
                            Empowering the next generation of developers with cutting-edge training and innovative software solutions.
                        </p>
                        <div className="footer-socials">
                            <a href="https://www.facebook.com/codepropk" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="https://wa.me/+923343401969" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                            <a href="https://www.linkedin.com/company/codepro-pk" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="https://www.instagram.com/codepro.pk" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </motion.div>

                    {/* Column 4: Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="footer-col"
                    >
                        <h4>Services</h4>
                        <ul className="footer-links">
                            <li><Link to="/software">Software Products</Link></li>
                            <li><Link to="/social">AIO Social Bot</Link></li>
                            <li><Link to="/courses">IT Courses</Link></li>
                            <li><Link to="/application">Admissions</Link></li>
                        </ul>
                    </motion.div>

                    {/* Column 3: Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="footer-col"
                    >
                        <h4>Navigation</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </motion.div>

                    {/* Column 4: Contact & Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="footer-col"
                    >
                        <h4>Contact Us</h4>
                        <div className="footer-contact-info">
                            <p><i className="fas fa-phone"></i> <a href="tel:+923343401969">+92 334 3401969</a></p>
                            <p><i className="fas fa-envelope"></i> <a href="mailto:info@codex.com.pk">info@codex.com.pk</a></p>
                            <p><i className="fas fa-map-marker-alt"></i> CODEX, behind Data Medicare Center, Prince Town Phase 1, Qasimabad, Hyderabad</p>
                        </div>
                    </motion.div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 CODEX. All Rights Reserved. Crafted with passion by NVIAM.</p>
                </div>
            </div>
        </footer>
    );
};

export default EnhancedFooter;
