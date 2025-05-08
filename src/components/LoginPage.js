import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import Header from "./Header";
import Footer from "./Footer";
import SocialButtons from "./SocialButtons";

const LoginPage = () => {
    return (
        <div className="login-page">
            <Header />

            <main className="login-main">
                <div className="login-wrapper">
                    <div className="login-card">
                        <div className="login-header">
                            <h1>Login</h1>
                            <p>Login to access your account.</p>
                        </div>

                        <form className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <div className="remember-me">
                                    <input type="checkbox" id="remember"/>
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" className="login-button">Login</button>

                            <div className="signup-link">
                                Don't have an account? <Link to="/signup">Sign up</Link>
                            </div>

                            <div className="social-login">
                                <div className="divider">Or login with</div>
                                <div className="social-buttons">
                                    <button type="button" className="social-button" aria-label="Login with Facebook">
                                        <img src={require('../assets/facebook.png')} alt=""/>
                                    </button>
                                    <button type="button" className="social-button" aria-label="Login with Google">
                                        <img src={require('../assets/google.png')} alt=""/>
                                    </button>
                                    <button type="button" className="social-button" aria-label="Login with Apple">
                                        <img src={require('../assets/apple.png')} alt=""/>
                                    </button>
                                </div>
                            </div>
                            {/*<SocialButtons />*/}
                        </form>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default LoginPage;