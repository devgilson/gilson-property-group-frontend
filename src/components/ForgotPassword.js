import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/AuthPages.css';
import SocialButtons from "./SocialButtons";

const ForgotPassword = () => {
    return (
        <div className="auth-page">
            <Header />

            <main className="auth-main">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Forgot your password?</h1>
                        <p>Enter your email below to recover your password.</p>
                    </div>

                    <form className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email address"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button">Submit</button>

                        <div className="auth-link">
                            <Link to="/login">← Back to login</Link>
                        </div>

                        {/*<div className="social-login">*/}
                        {/*    <div className="divider">Or login with</div>*/}
                        {/*    <div className="social-buttons">*/}
                        {/*        <button type="button" className="social-button">*/}
                        {/*            <img src={require('../assets/facebook.png')} alt="Facebook" />*/}
                        {/*        </button>*/}
                        {/*        <button type="button" className="social-button">*/}
                        {/*            <img src={require('../assets/google.png')} alt="Google" />*/}
                        {/*        </button>*/}
                        {/*        <button type="button" className="social-button">*/}
                        {/*            <img src={require('../assets/apple.png')} alt="Apple" />*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <SocialButtons />
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPassword;