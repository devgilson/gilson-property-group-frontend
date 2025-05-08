import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConciergeAndHospitality.css';

const ConciergeAndHospitality = () => {
    const navigate = useNavigate();
    const handleSearch = () => {

        navigate(`/search/results?category=essentials}`);
    };

    return (
        <div className="concierge-container">
            <div className="luxury-services">
                <h1>Luxury Services for an Effortless Stay</h1>
                <p>At Breckenridge Monthly, we go beyond just providing a home—we offer a seamless, high-end living experience. Our concierge services ensure that every detail of your stay is tailored to your needs, so you can focus on enjoying your extended mountain retreat.</p>
            </div>
            <h1>Exclusive Services</h1>
            <section className="service-section">
                <div className="service-content">
                    <h2>Private Chef Services</h2>
                    <p>Indulge in gourmet dining from the comfort of your home. Our private chefs craft personalized menus featuring fresh, local ingredients, from cozy fireside meals to elegant multi-course dinners.</p>
                </div>
                <img src={require('../assets/privatechefandservices.png')} alt="Private Chef and Services" />
            </section>
            <section className="service-section">
                <div className="service-content">
                    <h2>Grocery Delivery</h2>
                    <p>Arrive to a fully stocked kitchen with your favorite essentials. Choose from a one-time delivery or a recurring service to keep your home stocked throughout your stay.</p>
                </div>
                <img src={require('../assets/grocerydelivery.png')} alt="Grocery Delivery" />
            </section>
            <section className="service-section">
                <div className="service-content">
                    <h2>Spa Services</h2>
                    <p>Relax and rejuvenate with in-home spa treatments, including massages, facials, and wellness therapies—because true luxury is about unwinding in your own space.</p>
                </div>
                <img src={require('../assets/spaservice.png')} alt="Spa Service" />
            </section>
            <section className="service-section">
                <div className="service-content">
                    <h2>Baby Equipment</h2>
                    <p>Traveling with little ones? We provide high-quality cribs, strollers, and child-friendly essentials to ensure a comfortable stay for the whole family.</p>
                </div>
                <img src={require('../assets/babyequipment.png')} alt="Baby Equipment" />
            </section>
            <section className="service-section">
                <div className="service-content">
                    <h2>Full Trip Insurance</h2>
                    <p>Enjoy peace of mind with comprehensive insurance coverage, offering flexible protection options to safeguard your booking and experience.</p>
                </div>
                <img src={require('../assets/fulltripinsurance.png')} alt="Full Trip Insurance" />
            </section>
            <section className="service-section">
                <div className="service-content">
                    <h2>Guided Tours and Experiences</h2>
                    <p>Explore Breckenridge like never before with curated tours—from private ski guides to scenic helicopter rides, custom hiking excursions, and cultural experiences.</p>
                </div>
                <img src={require('../assets/guidedtoursandexperiences.png')} alt="Guided Tours and Experiences" />
            </section>
            <section className="book-your-stay-section">
                <h2>Book Your Stay</h2>
                <p>Need a custom-tailored experience? Our concierge team can design a personalized package with services that align with your lifestyle. Let us know what you need, and we’ll handle the rest.</p>
                <button className="explore-button" onClick={handleSearch}>Explore Home Collections</button>
            </section>
        </div>
    );
};

export default ConciergeAndHospitality;