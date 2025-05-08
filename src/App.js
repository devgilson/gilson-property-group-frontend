import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import AboutPage from "./components/Aboutpage";
import ReservationsPage from "./components/ReservationPage";
import PropertyDetails from "./components/PropertyDetails";
import SearchResults from "./components/SearchResults";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PasswordSuccess from "./components/PasswordSuccess";
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import ConciergeAndHospitality from './components/ConciergeAndHospitality';
import Footer from './components/Footer';
import Collections from './components/Collections';
import Management from './components/Management';
import './styles/App.css';
import './styles/variables.css';
import './styles/common-styles.css';
import ReservationPage from './components/ReservationPage';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="error">Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/password-reset-success" element={<PasswordSuccess />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/search/results" element={<SearchResults />} />
                        <Route path="/about-us" element={<AboutPage />} />
                        <Route path="/concierge" element={<ConciergeAndHospitality />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/reservation" element={<ReservationPage />} />
                        <Route path="/reservations" element={
                            <PrivateRoute>
                                <ReservationsPage />
                            </PrivateRoute>
                        } />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/management" element={<Management />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;