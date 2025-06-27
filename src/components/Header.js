import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if (user) {
            console.log("User email:", user.email);
        } else {
            navigate('/login');
        }
    };

    return (
        <header className="site-header">
            <div className="header-left">
                <Link to="/collections" className="nav-link">Home Collections</Link>
                <Link to="/concierge" className="nav-link">Concierge & Hospitality</Link>
            </div>

            <div className="header-center">
                <Link to="/" className="logo-link">
                    <img src={require('../assets/logo.png')} alt="Gilson Property Group" />
                </Link>
            </div>

            <div className="header-right">
                <Link to="/management" className="nav-link">Management</Link>
                <Link to="/about-us" className="nav-link">About Us</Link>

                <div className="icon-pill">
                    <button className="icon-button">
                        <img src={require('../assets/shopping.png')} alt="Cart" />
                    </button>
                    <div className="profile-wrapper">
                        <button
                            className="icon-button"
                            onClick={handleProfileClick}
                            title={user ? user.email : 'Login'}
                        >
                            <img src={require('../assets/login.png')} alt="Profile" />
                        </button>
                        {user && (
                            <div className="profile-dropdown">
                                <p>{user.email}</p>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                    <button className="icon-button">
                        <img src={require('../assets/menu.png')} alt="Menu" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
