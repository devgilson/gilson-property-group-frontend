import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Collections.css';
import collectionImage from '../assets/homecollection.png';

const Collections = () => {
    const [activeTab, setActiveTab] = useState('Essentials');
    const navigate = useNavigate();

    // Map the tab IDs to the corresponding collection values used in the search
    const collectionMapping = {
        Essentials: 'essentials',
        Resort: 'resort',
        Luxury: 'luxury',
        Independence: 'independence',
        DayPlus: '30day'
    };

    const tabs = [
        { id: 'Essentials', label: 'Essentials' },
        { id: 'Resort', label: 'Resort' },
        { id: 'Luxury', label: 'Luxury' },
        { id: 'Independence', label: 'Independence' },
        { id: 'DayPlus', label: '30 Day+' },
    ];

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
            description: "Experience resort-style living with premium amenities and services.",
            features: [
                "Luxurious furnishings and high-end finishes",
                "Access to resort facilities and concierge",
                "Premium kitchen with gourmet appliances",
                "Spacious layouts with mountain views",
                "Prime locations near ski lifts and trails"
            ],
            buttonText: "Explore Resort"
        },
        Luxury: {
            title: "Luxury Collection",
            description: "The pinnacle of mountain living with exceptional design and service.",
            features: [
                "Designer furnishings and custom interiors",
                "Smart home technology throughout",
                "Professional-grade chef's kitchen",
                "Expansive outdoor living spaces",
                "Most exclusive locations in Breckenridge"
            ],
            buttonText: "Explore Luxury"
        },
        Independence: {
            title: "Independence Collection",
            description: "Perfect for those who value space and privacy in the mountains.",
            features: [
                "Private, standalone properties",
                "Generous square footage for families/groups",
                "Fully equipped for long-term comfort",
                "Peaceful locations with mountain views",
                "Garage and additional storage space"
            ],
            buttonText: "Explore Independence"
        },
        DayPlus: {
            title: "30 Day+ Collection",
            description: "Specialized homes designed for extended stays of a month or longer.",
            features: [
                "Discounted rates for long-term bookings",
                "All utilities and services included",
                "Laundry facilities in every unit",
                "Pet-friendly options available",
                "Flexible lease terms"
            ],
            buttonText: "Explore 30 Day+"
        }
    };

    const handleExploreClick = (collectionId) => {
        // Get the corresponding collection value from the mapping
        const collectionValue = collectionMapping[collectionId];
        // Navigate to search results with the collection filter applied
        navigate(`/search/results?category=${collectionValue}`);
    };

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

            <div className="collection-card">
                <div className="card-content">
                    <h2>{collectionsData[activeTab].title}</h2>
                    <p className="description">{collectionsData[activeTab].description}</p>
                    <ul className="features-list">
                        {collectionsData[activeTab].features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <button 
                        className="explore-button"
                        onClick={() => handleExploreClick(activeTab)}
                    >
                        {collectionsData[activeTab].buttonText}
                    </button>
                </div>
                <div className="card-image">
                    <img src={collectionImage} alt={collectionsData[activeTab].title} />
                </div>
            </div>
        </div>
    );
};

export default Collections;