import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/AuthPages.css';

const PasswordSuccess = () => {
    return (
        <div className="auth-page">
            <Header />

            <main className="auth-main">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Password successfully reset</h1>
                    </div>

                    <div className="auth-success">
                        <Link to="/login" className="auth-button">Login</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PasswordSuccess;