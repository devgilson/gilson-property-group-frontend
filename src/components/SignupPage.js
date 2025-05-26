import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles/SignupPage.css';
import Header from "./Header";
import Footer from "./Footer";
import SocialButtons from "./SocialButtons";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch("http://143.198.108.5:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                firstName: "FirstName",
                lastName: "LastName",
                email: "name@example.com",
                password: "SecurePassword123!"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Registration error details:", errorData);
            throw new Error(errorData.message || "Registration failed");
        }

        const data = await response.json();
        console.log("Registration successful:", data);
    } catch (error) {
        console.error("Registration error:", error);
    }
};

    return (
        <div className="signup-page">
            <Header />
            <main className="signup-main">
                <div className="signup-wrapper">
                    <div className="signup-card">
                        <div className="signup-header">
                            <h1>Sign up</h1>
                            <p>Let's get you started.</p>
                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="name-fields">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    minLength="8"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Re-enter password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
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

                            <button 
                                type="submit" 
                                className="signup-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>

                            <div className="login-link">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </div>

                            <SocialButtons isSignup={true} />
                        </form>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default SignupPage;