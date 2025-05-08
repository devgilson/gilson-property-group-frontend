import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/check-session`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    setUser({ email: data.email });
                }
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();

        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                logout();
            }, 30 * 60 * 1000);
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
        };
    }, []);

    const login = async (email) => {
        setUser({ email });
    };

    const logout = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};