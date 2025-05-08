import React, {useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import {AuthContext} from "../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleProfileClick = () => {
        if (user) {
            // Show profile dropdown or navigate to profile page
            console.log("User email:", user.email);
        } else {
            navigate('/login');
        }
    };
    return (
        <nav className="navbar">
            {/* Left Navigation */}
            <div className="nav-section left-section">
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/collections">Home Collections</Link></li>
                    <li className="nav-item"><Link to="/concierge">Concierge & Hospitality</Link></li>
                </ul>
            </div>

            {/* Logo - Centered */}
            <div className="logo-section">
                <Link to="/" className="logo">
                    <img src={require('../assets/logo.png')} alt="GILSON PROPERTY GROUP"/>
                </Link>
            </div>

            {/* Right Navigation + Icons */}
            <div className="nav-section right-section">
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/management">Management</Link></li>
                    <li className="nav-item"><Link to="/about-us">About Us</Link></li>
                </ul>

                <div className="icons-menu">
                    <button className="icon-button">
                        <img src={require('../assets/shopping.png')} alt="Cart"/>
                    </button>
                    <div className="profile-container">
                        <button
                            className="icon-button"
                            onClick={handleProfileClick}
                            title={user ? user.email : 'Login'}
                        >
                            <img src={require('../assets/login.png')} alt="Profile"/>
                        </button>
                        {user && (
                            <div className="profile-dropdown">
                                <p>{user.email}</p>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                    <button className="icon-button">
                        <img src={require('../assets/menu.png')} alt="Menu"/>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;