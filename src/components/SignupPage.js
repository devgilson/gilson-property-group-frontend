import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';
import Header from "./Header";
import Footer from "./Footer";
import SocialButtons from "./SocialButtons";

const SignupPage = () => {
    return (
        <div className="signup-page">
            <Header />

            <main className="signup-main">
                <div className="signup-wrapper">
                    <div className="signup-card">
                        <div className="signup-header">
                            <h1>Sign up</h1>
                            <p>Let's get you started.</p>
                        </div>

                        <form className="signup-form">
                            <div className="name-fields">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
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

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Re-enter password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <div className="terms-agreement">
                                    <input type="checkbox" id="terms" required/>
                                    <label htmlFor="terms">I agree to all the Terms and Privacy Policies</label>
                                </div>
                            </div>

                            <button type="submit" className="signup-button">Create account</button>

                            <div className="login-link">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </div>

                            {/*<div className="social-login">*/}
                            {/*    <div className="divider">Or login with</div>*/}
                            {/*    <div className="social-buttons">*/}
                            {/*        <button type="button" className="social-button" aria-label="Login with Facebook">*/}
                            {/*            <img src={require('../assets/facebook.png')} alt=""/>*/}
                            {/*        </button>*/}
                            {/*        <button type="button" className="social-button" aria-label="Login with Google">*/}
                            {/*            <img src={require('../assets/google.png')} alt=""/>*/}
                            {/*        </button>*/}
                            {/*        <button type="button" className="social-button" aria-label="Login with Apple">*/}
                            {/*            <img src={require('../assets/apple.png')} alt=""/>*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <SocialButtons/>
                        </form>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default SignupPage;