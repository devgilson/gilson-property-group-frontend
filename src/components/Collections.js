import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Collections.css';
import collectionImage from '../assets/homecollection.png';

const Collections = () => {
    const [activeTab, setActiveTab] = useState('Essentials');
    const navigate = useNavigate();

    const tabs = [
        { id: 'Essentials', label: 'Essentials' },
        { id: 'Resort', label: 'Resort' },
        { id: 'Luxury', label: 'Luxury' },
        { id: 'Independence', label: 'Independence' },
        { id: 'DayPlus', label: '30 Day+' },
    ];

    const collectionMapping = {
        Essentials: 'essentials',
        Resort: 'resort',
        Luxury: 'luxury',
        Independence: 'independence',
        DayPlus: '30day'
    };

    const collectionsData = {
        Essentials: {
            title: "Essentials Collection",
            description: "A well-appointed home with everything you need for a seamless long-term stay.",
            features: [
                "Fully furnished with stylish, functional interiors",
                "High-speed WiFi and dedicated workspace",
                "Modern kitchen with everyday essentials",
                "Comfortable living spaces designed for extended stays",
                "Convenient locations near Breckenridge's best spots"
            ],
            buttonText: "Explore Essentials"
        },
        Resort: {
            title: "Resort Collection",
            description: "Amenities-driven homes offering a resort-style experience with extra comfort.",
            features: [
                "Access to pools, hot tubs, and wellness facilities",
                "Concierge services for personalized recommendations",
                "Ski-in/ski-out options for effortless mountain access",
                "Upscale furnishings with an emphasis on relaxation",
                "Premium entertainment systems and home automation"
            ],
            buttonText: "Explore Resort"
        },
        Luxury: {
            title: "Luxury Collection",
            description: "The most exclusive homes for an unmatched, high-end mountain retreat.",
            features: [
                "Expansive estates with panoramic mountain views",
                "Bespoke interior design featuring premium materials",
                "Private chef, butler, and concierge services available",
                "Spa-like bathrooms and top-tier amenities",
                "Exclusive, secluded locations for ultimate privacy"
            ],
            buttonText: "Explore Luxury"
        },
        Independence: {
            title: "Independence Collection",
            description: "Handpicked homes perfect for celebrating the changing beauty of the Rockies.",
            features: [
                "Cozy cabins for winter escapes with fireplaces and heated floors",
                "Breezy, sunlit homes for the perfect summer retreat",
                "Scenic fall foliage views and access to hiking trails",
                "Outdoor living spaces, from fire pits to private balconies",
                "Designed to capture the magic of each season in Breckenridge"
            ],
            buttonText: "Explore Seasonal"
        },
        DayPlus: {
            title: "30 Day + Collection",
            description: "Handpicked homes perfect for extended stays of a month or longer.",
            features: [
                "Cozy cabins for winter escapes with fireplaces and heated floors",
                "Breezy, sunlit homes for the perfect summer retreat",
                "Scenic fall foliage views and access to hiking trails",
                "Outdoor living spaces, from fire pits to private balconies",
                "Designed to capture the magic of each season in Breckenridge"
            ],
            buttonText: "Explore Seasonal"
        }
    };

    const handleExploreClick = (collectionId) => {
        const collectionValue = collectionMapping[collectionId];
        navigate(`/search/results?category=${collectionValue}`);
    };

    const sortedCollections = [
        activeTab,
        ...tabs.filter(tab => tab.id !== activeTab).map(tab => tab.id)
    ];

    return (
        <div className="collections-container">
            <h1>Find your next home.</h1>
            <p className="intro-text">
                Each Home Collection is designed to match different lifestyles and preferences. Whether you're seeking a cozy, well-equipped stay, a resort-like experience, a seasonal escape, or the pinnacle of luxury, our curated homes provide the ideal setting for your extended mountain getaway.
            </p>

            <div className="tabs-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {sortedCollections.map((key) => (
                <div key={key} className="collection-card">
                    <div className="card-content">
                        <h2>{collectionsData[key].title}</h2>
                        <p className="description">{collectionsData[key].description}</p>
                        <ul className="features-list">
                            {collectionsData[key].features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <button
                            className="explore-button"
                            onClick={() => handleExploreClick(key)}
                        >
                            {collectionsData[key].buttonText}
                        </button>
                    </div>
                    <div className="card-image">
                        <img src={collectionImage} alt={collectionsData[key].title} />
                    </div>
                </div>
            ))}

            {/* Explore Michigan Section */}
            <div className="info-section">
                <h2>Explore Michigan Stays</h2>
                <p className="info-subtext">
                    While our roots are in the breathtaking landscapes of Colorado, we're excited to offer equally stunning monthly rental experiences in Michigan.
                    Our Michigan home collection brings the same level of exclusivity, comfort, and luxury you expect.
                </p>
                <button
                    className="info-button"
                    onClick={() => navigate('/search/results?state=Michigan')}
                >
                    Go to Michigan homes
                </button>
            </div>

            {/* Free Rental Evaluation */}
            <div className="info-section">
                <h2>Free Rental Evaluation</h2>
                <p className="info-subtext">
                    Curious about your property's rental potential? Get a personalized evaluation and discover how much you could earn with a 30-day rental.
                    No commitment, just insights!
                </p>
                <button
                    className="info-button"
                    onClick={() => navigate('/rental-evaluation')}
                >
                    Get Your Free Rental Evaluation
                </button>
            </div>
        </div>
    );
};

export default Collections;
