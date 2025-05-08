import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/AuthPages.css';

const ResetPassword = () => {
    return (
        <div className="auth-page">
            <Header />

            <main className="auth-main">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Set a password</h1>
                        <p>Please set a new password for your account.</p>
                    </div>

                    <form className="auth-form">
                        <div className="form-group">
                            <label htmlFor="password">Create password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Re-enter password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button">Set password</button>

                        <div className="auth-link">
                            <Link to="/login">← Back to login</Link>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ResetPassword;