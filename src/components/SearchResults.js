import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        collection: 'Any',
        squareFt: 'Any',
        bedrooms: 'Any',
        bathrooms: 'Any',
        dates: 'MM/DD - MM/DD',
        sort: 'lowToHigh'
    });
    
    // Updated collection options to match backend exactly
    const collectionOptions = [
        { value: '', label: 'Any Collection' },
        { value: 'essentials', label: 'Essentials' },
        { value: 'resort', label: 'Resort' },
        { value: 'luxury', label: 'Luxury' },
        { value: 'independence', label: 'Independence' },
        { value: '30day', label: '30 Day +' },
        { value: 'northern', label: 'Northern Summit' },
        { value: 'southpark', label: 'South Park' },
        { value: 'michigan', label: 'Hometown Michigan' }
    ];

    const handleCollectionChange = (e) => {
        const collectionValue = e.target.value;
        const searchParams = new URLSearchParams(location.search);

        if (collectionValue) {
            searchParams.set('category', collectionValue);
        } else {
            searchParams.delete('category');
        }

        // Reset to first page when changing collection
        searchParams.set('page', '0');
        navigate(`/search/results?${searchParams.toString()}`);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setFilters(prev => ({ ...prev, sort: newSort }));

        const searchParams = new URLSearchParams(location.search);
        searchParams.set('sort', newSort);
        navigate(`/search/results?${searchParams.toString()}`, { replace: true });
    };

    const handleResetFilters = () => {
        navigate('/search/results');
    };

    const handlePropertyClick = (propertyId) => {
        const searchParams = new URLSearchParams(location.search);
        navigate(`/property/${propertyId}?${searchParams.toString()}`);
      };
      
      useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Build the API URL with all parameters
                let apiUrl = `${apiBaseUrl}/properties/search/results?${searchParams.toString()}`;
                console.log('Fetching results from:', apiUrl);
    
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('API response:', data);
                
                setResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError(err.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchResults();
    }, [location.search]);

    if (loading) {
        return (
            <div className="search-results-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading properties...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-results-container">
                <div className="error-state">
                    <h3>Error loading properties</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <main className="search-results-content">
                <h1 className="page-title">
                    {filters.collection === 'Any Collection' ? 'All Properties' : `${filters.collection} Properties`}
                    {results.length > 0 && <span className="property-count"> ({results.length})</span>}
                </h1>

                <div className="filters-section">
                    <div className="filter-group">
                        <label>Collection:</label>
                        <select
                            value={collectionOptions.find(opt => opt.label === filters.collection)?.value || ''}
                            onChange={handleCollectionChange}
                            className="filter-select"
                        >
                            {collectionOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort by:</label>
                        <select
                            value={filters.sort}
                            onChange={handleSortChange}
                            className="filter-select"
                        >
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                            <option value="bedroomsHigh">Bedrooms: High to Low</option>
                            <option value="bedroomsLow">Bedrooms: Low to High</option>
                        </select>
                    </div>

                    <div className="active-filters">
                        <span>Dates: {filters.dates}</span>
                        {filters.bedrooms !== 'Any' && <span>Bedrooms: {filters.bedrooms}</span>}
                        {filters.bathrooms !== 'Any' && <span>Bathrooms: {filters.bathrooms}</span>}
                        <button className="reset-btn" onClick={handleResetFilters}>Reset Filters</button>
                    </div>
                </div>

                {results.length === 0 ? (
                    <div className="no-results">
                        <h3>No properties found in {filters.collection.toLowerCase()}</h3>
                        <p>Try adjusting your search filters or selecting a different collection</p>
                    </div>
                ) : (
                    <>
                        <div className="properties-grid">
                            {results.map((property) => (
                                <div 
                                    key={property.propertyId} 
                                    className="property-card"
                                    onClick={() => handlePropertyClick(property.propertyId)}
                                >
                                    <div className="property-image-container">
                                        <img
                                            src={property.pictureUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available'}
                                            alt={property.name}
                                            className="property-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                                            }}
                                        />
                                        {property.collection && (
                                            <span className="collection-badge">{property.collection}</span>
                                        )}
                                    </div>

                                    <div className="property-details">
                                        <h2 className="property-title">{property.name}</h2>
                                        <p className="property-location">
                                            {property.city}, {property.state || property.region}, {property.country}
                                        </p>
                                        <div className="property-specs">
                                            <span>{property.bedrooms || 'N/A'} beds</span>
                                            <span>{property.bathrooms || 'N/A'} baths</span>
                                            <span>Sleeps {property.maxGuests || 'N/A'}</span>
                                        </div>
                                        <div className="property-price">
                                            ${property.pricePerNight || property.basePrice || 'N/A'} <span>/ night</span>
                                        </div>
                                        {property.amenities && (
                                            <div className="property-amenities">
                                                {Array.isArray(property.amenities) 
                                                    ? property.amenities.slice(0, 3).join(' · ')
                                                    : property.amenities}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="exclusive-services-section">
                            <div className="exclusive-services-content">
                                <h2>Exclusive Services</h2>
                                <p>
                                    Breckenridge Monthly, we go beyond just providing a home—we offer a seamless,
                                    high-end living experience. Our concierge services ensure that every detail
                                    of your stay is tailored to your needs, so you can focus on enjoying your
                                    extended mountain retreat.
                                </p>
                                <button
                                    className="exclusive-services-button"
                                    onClick={() => navigate('/concierge')}
                                >
                                    View Exclusive Services
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default SearchResults;