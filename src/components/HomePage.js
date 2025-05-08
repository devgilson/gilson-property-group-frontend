import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import vector from '../assets/vector.png';
import frame12 from '../assets/Frame 12.png';
import frame13 from '../assets/Frame 13.png';
import frame14 from '../assets/Frame 14.png';
import chef from '../assets/chef.png'; 
import ReviewsCarousel from "./ReviewsCarousel";
import FeaturedHomes from "./FeaturedHomes";
import SearchBar from "./SearchBar";
import BreckenridgeExperience from "./BreckenridgeExperience";
import Header from "./Header";
import Footer from "./Footer";

const HomePage = () => {
    return (
        <div className="home-page">
            <Header />
            <div className="hero-section">
                <h1>Life begins in Breckenridge.</h1>
                <div className="flex-container">
                    <p className="flex-paragraph">Book an exclusive, high-end mountain living with curated stays
                        designed for comfort and adventure.</p>
                    <img src={vector} alt="Vector" className="vector"/>
                    <p className="flex-paragraph">Feel at home on day one with luxury at your service every step of the
                        way.</p>
                </div>
            </div>

            <SearchBar/>
            <div className="image-container">
                    <img 
                        src={require('../assets/homePageFirstSection.jpeg')} 
                        alt="Breckenridge" 
                        className="main-image"
                    />
                    </div>
            <div className="static-content">
            
                <div className="flex-container">
                    <div className="text-content">
                        <h2>An Elevated Home</h2>
                        <p>Experience the warmth of a fully furnished mountain retreat, designed for extended stays with
                            comfort, elegance, and breathtaking views.
                            Enjoy private spaces and thoughtfully curated community amenities that make every stay feel
                            like home.</p>
                    </div>
                    <img src={frame12} alt="Frame 12" className="frame-image"/>
                </div>
                <div className="flex-container">
                    <div className="text-content">
                        <h2>Effortless Booking</h2>
                        <p>Our seamless digital booking process ensures a stress-free start to your stay.
                            Select your ideal property, customize your experience with premium add-ons,
                            and connect directly with our team for a personalized touch.</p>
                    </div>
                    <img src={frame13} alt="Frame 13" className="frame-image"/>
                </div>

                <div className="flex-container">
                    <div className="text-content">
                        <h2>Luxury Made Simple</h2>
                        <p>Arrive and unwind—your home is move-in ready, complete with high-end furnishings, modern
                            conveniences, and premium services. We handle the details, so you can focus on enjoying your
                            Breckenridge escape.</p>
                    </div>
                    <img src={frame14} alt="Frame 14" className="frame-image"/>
                </div>
            </div>
            <FeaturedHomes/>
            <div className="free-rentalevaluation">
                <h2 className="section-title">FREE RENTAL EVALUATION</h2>
                <p className="concierge-subtitle">Curious about your property's rental potential? Get a personalized evaluation and discover how much you could earn with a 30-day rental. No commitment, just insights!</p>
                <button className="view-all-button">Get Your Free Rental Evaluation</button>
            </div>
            <BreckenridgeExperience/>
            <div className="concierge-section">
                <h2 className="section-title">EXCLUSIVE CONCIERGE & HOSPITALITY</h2>
                
                <div className="concierge-content-wrapper">
                    <div className="concierge-image">
                        <img src={chef} alt="Private chef service" />
                    </div>
                    
                    <div className="concierge-content">
                        <p className="concierge-subtitle">Add premium offerings to your stay</p>
                        <ul className="concierge-list">
                            <li>Private chef</li>
                            <li>Butler service</li>
                            <li>Daily housekeeping</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ReviewsCarousel />
            <Footer />
        </div>
    );
};

export default HomePage;