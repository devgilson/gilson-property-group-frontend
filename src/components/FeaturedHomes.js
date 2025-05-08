import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FeaturedHomes.css';

const FeaturedHomes = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const propertyTypes = [
        { id: 'all', name: 'All' },
        { id: 'essentials', name: 'Essentials' },
        { id: 'resort', name: 'Resort' },
        { id: 'luxury', name: 'Luxury' },
        { id: 'independence', name: 'Independence' },
        { id: '30day', name: '30 Day +' },
        { id: 'northern', name: 'Northern Summit' },
        { id: 'southpark', name: 'South Park' },
        { id: 'michigan', name: 'Hometown Michigan' }
    ];

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiBaseUrl}/properties/featured/${activeTab.toLowerCase()}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Error fetching featured properties:', error);
                setProperties([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, [activeTab]);

    const handleViewAll = () => {
        navigate(`/search/results?category=${activeTab.toLowerCase()}`);
    };

    const handlePropertyClick = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    if (loading) {
        return (
            <div className="featured-homes">
                <div className="loading-spinner"></div>
                <p>Loading featured properties...</p>
            </div>
        );
    }

    return (
        <div className="featured-homes">
            <h2 className="section-title">Featured Homes</h2>

            <div className="property-type-filter">
                {propertyTypes.map((type) => (
                    <button 
                        key={type.id}
                        className={`type-button ${activeTab === type.name ? 'active' : ''}`}
                        onClick={() => setActiveTab(type.name)}
                    >
                        {type.name}
                    </button>
                ))}
            </div>

            <div className="divider"></div>

            {properties.length === 0 ? (
                <div className="no-results">
                    <p>No featured properties found for this category.</p>
                </div>
            ) : (
                <>
                    <div className="properties-grid">
                        {properties.map((property) => (
                            <div 
                                key={property.id || property.propertyId} 
                                className="property-card"
                                onClick={() => handlePropertyClick(property.propertyId || property.id)}
                            >
                                <img 
                                    src={property.pictureUrl || 'https://via.placeholder.com/300x200?text=Property+Image'} 
                                    alt={property.name} 
                                    className="property-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x200?text=Property+Image';
                                    }}
                                />
                                <div className="property-content">
                                    <h3 className="property-title">{property.name}</h3>
                                    <p className="property-location">{property.city}, {property.state || property.region}</p>
                                    <div className="property-specs">
                                        <span>{property.bedrooms || 'N/A'} beds</span>
                                        <span>{property.bathrooms || 'N/A'} baths</span>
                                        {property.maxGuests && <span>Sleeps {property.maxGuests}</span>}
                                    </div>
                                    {property.pricePerNight && (
                                        <div className="property-price">
                                            ${property.pricePerNight} <span>/ night</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="view-all-button" onClick={handleViewAll}>
                        View all {activeTab.toLowerCase() === 'all' ? 'homes' : activeTab + ' homes'}
                    </button>
                </>
            )}
        </div>
    );
};

export default FeaturedHomes;