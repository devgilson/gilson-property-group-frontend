// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <ul className="footer-links">
                    <li><Link to="/listings">Our Listings</Link></li>
                    <li><Link to="/instagram">Instagram</Link></li>
                    <li><Link to="/concierge">Concierge & Hospitality</Link></li>
                    <li><Link to="/social">Social Link</Link></li>
                    <li><Link to="/management">Management</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                </ul>
                <p className="footer-text">© Green Property Group, LLC</p>
            </div>
        </footer>
    );
};

export default Footer;