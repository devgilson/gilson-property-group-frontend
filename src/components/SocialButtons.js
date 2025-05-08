import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { socialLogin } from '../services/authService';
import facebookIcon from '../assets/facebook.png';
import googleIcon from '../assets/google.png';
import appleIcon from '../assets/apple.png';
import '../styles/SocialButtons.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_AUTH_URL;

const SocialLoginButtons = ({ isSignup = false }) => {
    const navigate = useNavigate();

    const handleSocialLogin = async (provider) => {
        try {
            const authWindow = window.open(
                `${API_BASE_URL}/oauth2/authorize/${provider}?redirect_uri=${window.location.origin}/oauth-redirect`,
                '_blank',
                'width=500,height=600'
            );

            window.addEventListener('message', async (event) => {
                if (event.origin !== window.location.origin) return;

                if (event.data.token) {
                    try {
                        // const user = await socialLogin(provider, event.data.token);
                        navigate('/dashboard');
                    } catch (loginError) {
                        alert(`Login failed: ${loginError.message}`);
                    }
                } else if (event.data.error) {
                    alert(`Social login failed: ${event.data.error}`);
                }

                authWindow.close();
            }, { once: true });
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    };

    return (
        <div className="social-login">
            <div className="divider">Or {isSignup ? 'sign up' : 'login'} with</div>
            <div className="social-buttons">
                <button
                    type="button"
                    className="social-button"
                    onClick={() => handleSocialLogin('facebook')}
                >
                    <img src={facebookIcon} alt="Facebook" />
                </button>
                <a href={`${API_BASE_URL}/oauth2/authorization/google?redirect_uri=${window.location.origin}/oauth-redirect`} className="social-button">
                    <img src={googleIcon} alt="Sign in with Google" />
                </a>
                <button
                    type="button"
                    className="social-button"
                    onClick={() => handleSocialLogin('apple')}
                >
                    <img src={appleIcon} alt="Apple" />
                </button>
            </div>
        </div>
    );
};

export default SocialLoginButtons;