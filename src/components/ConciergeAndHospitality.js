import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConciergeAndHospitality.css';

const ConciergeAndHospitality = () => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/search/results?category=essentials`);
    };

    const services = [
        {
            title: 'Private Chef Services',
            description: 'Indulge in gourmet dining from the comfort of your home. Our private chefs craft personalized menus featuring fresh, local ingredients, from cozy fireside meals to elegant multi-course dinners.',
            image: require('../assets/privatechefandservices.png'),
            alt: 'Private Chef Services'
        },
        {
            title: 'Grocery Delivery',
            description: 'Arrive to a fully stocked kitchen with your favorite essentials. Choose from a one-time delivery or a recurring service to keep your home stocked throughout your stay.',
            image: require('../assets/grocerydelivery.png'),
            alt: 'Grocery Delivery'
        },
        {
            title: 'Spa Services',
            description: 'Relax and rejuvenate with in-home spa treatments, including massages, facials, and wellness therapies—because true luxury is about unwinding in your own space.',
            image: require('../assets/spaservice.png'),
            alt: 'Spa Services'
        },
        {
            title: 'Baby Equipment Rental',
            description: 'Traveling with little ones? We provide high-quality cribs, strollers, and child-friendly essentials to ensure a comfortable stay for the whole family.',
            image: require('../assets/babyequipment.png'),
            alt: 'Baby Equipment'
        },
        {
            title: 'Full Trip Insurance',
            description: 'Enjoy peace of mind with comprehensive insurance coverage, offering flexible protection options to safeguard your booking and experience.',
            image: require('../assets/fulltripinsurance.png'),
            alt: 'Full Trip Insurance'
        },
        {
            title: 'Guided Tours & Experiences',
            description: 'Explore Breckenridge like never before with curated tours—from private ski guides to scenic helicopter rides, custom hiking excursions, and cultural experiences.',
            image: require('../assets/guidedtoursandexperiences.png'),
            alt: 'Guided Tours'
        }
    ];

    return (
        <div className="concierge-and-hospitality">
        <div className="concierge-container">
            <section className="luxury-services">
                <h1>Luxury Services for an Effortless Stay</h1>
                <p>
                    At Breckenridge Monthly, we go beyond just providing a home—we offer a seamless, high-end living experience.
                    Our concierge services ensure that every detail of your stay is tailored to your needs, so you can focus on enjoying your extended mountain retreat.
                </p>
            </section>

            <h2 className="exclusive-heading">Exclusive Services</h2>

            <div className="service-list">
                {services.map((service, index) => (
                    <section className="service-section" key={index}>
                        <div className="service-content">
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                        <img src={service.image} alt={service.alt} />
                    </section>
                ))}
            </div>

            <section className="book-your-stay-section">
                <h2>Book your stay</h2>
                <p>
                    Need a custom-tailored experience? Our concierge team can design a personalized package with services that align with your lifestyle.
                    Let us know what you need, and we’ll handle the rest.
                </p>
                <button className="explore-button" onClick={handleSearch}>
                    Explore Home Collections
                </button>
            </section>
        </div>
        </div>
    );
};

export default ConciergeAndHospitality;
