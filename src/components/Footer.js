import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <div className="link-column">
                        <Link to="/listings">Our Listings</Link>
                        <Link to="/concierge">Concierge & Hospitality</Link>
                        <Link to="/management">Management</Link>
                        <Link to="/about-us">About Us</Link>
                    </div>
                    <div className="link-column">
                        <Link to="/instagram">Instagram</Link>
                        <Link to="/social">Social Link</Link>
                    </div>
                </div>
                <p className="footer-bottom-text">© Gilson Property Group, LLC.</p>
            </div>
        </footer>
    );
};

export default Footer;
