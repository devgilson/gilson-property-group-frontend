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
        { id: 'michigan', name: 'Hometown Michigan' },
        { id: '30day', name: '30 Day +' }
    ];

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiBaseUrl}/properties/featured/${activeTab.toLowerCase()}`);
                const data = await response.json();
                setProperties(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching featured properties:', error);
                setProperties([]);
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

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : properties.length === 0 ? (
                <p>No featured properties found for this category.</p>
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
                                    className="property-image"
                                    src={property.pictureUrl || 'https://via.placeholder.com/300x200?text=Image'}
                                    alt={property.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }}
                                />
                                <div className="property-content">
                                    <h3 className="property-title">{property.name}</h3>
                                    <p className="property-details">
                                        {(property.bedrooms || 'N/A')} Beds • {(property.bathrooms || 'N/A')} Baths
                                    </p>
                                    <p className="property-description">
                                        {property.description
                                            ? property.description.slice(0, 220) + '...'
                                            : 'No description available.'}
                                    </p>
                                    <span style={{ marginTop: 'auto', textAlign: 'right', display: 'block' }}>→</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="view-all-button" onClick={handleViewAll}>
                        View all homes
                    </button>
                </>
            )}
        </div>
    );
};

export default FeaturedHomes;
