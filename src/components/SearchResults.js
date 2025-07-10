import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdjustAlert, setShowAdjustAlert] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        collection: 'Any',
        squareFt: 'Any',
        bedrooms: 'Any',
        bathrooms: 'Any',
        dates: 'MM/DD - MM/DD',
        sort: 'lowToHigh'
    });

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
        if (!loading && !error && results.length > 0) {
            const searchParams = new URLSearchParams(location.search);
            const adults = parseInt(searchParams.get('adults')) || 0;
            const children = parseInt(searchParams.get('children')) || 0;
            const pets = parseInt(searchParams.get('pets')) || 0;
            const totalGuests = adults + children;

            const hasMatchingProperties = results.some(property => {
                const matchesGuests = property.maxGuests >= totalGuests;
                const matchesPets = pets === 0 || property.petsAllowed;
                const available = property.available !== false && property.meetsMinStay !== false;
                return matchesGuests && matchesPets && available;
            });

            setShowAdjustAlert(!hasMatchingProperties);
        }
    }, [loading, error, results, location.search]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                const searchParams = new URLSearchParams(location.search);
                const params = {
                    checkIn: searchParams.get('checkIn'),
                    checkOut: searchParams.get('checkOut'),
                    state: searchParams.get('state'),
                    propertyId: searchParams.get('propertyId'),
                    adults: searchParams.get('adults') || '2',
                    children: searchParams.get('children') || '0',
                    infants: searchParams.get('infants') || '0',
                    pets: searchParams.get('pets') || '0'
                };

                if (!params.checkIn || !params.checkOut) {
                    throw new Error('Missing date parameters');
                }

                const queryString = new URLSearchParams({
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    adults: params.adults,
                    children: params.children,
                    infants: params.infants,
                    pets: params.pets,
                    ...(params.state && { state: params.state }),
                    ...(params.propertyId && { propertyId: params.propertyId })
                }).toString();

                const response = await fetch(`${apiBaseUrl}/properties/search/results?${queryString}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const results = Array.isArray(data) ? data : (data.content || data.results || []);
                setResults(results);

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

    const renderPropertyCard = (property) => {
        const searchParams = new URLSearchParams(location.search);
        const adults = parseInt(searchParams.get('adults')) || 0;
        const children = parseInt(searchParams.get('children')) || 0;
        const pets = parseInt(searchParams.get('pets')) || 0;
        const totalGuests = adults + children;

        const matchesGuests = property.maxGuests >= totalGuests;
        const matchesPets = pets === 0 || property.petsAllowed;
        const isMatch = matchesGuests && matchesPets;
        const isBelowMinStay = property.meetsMinStay === false;
        const isBlocked = property.available === false || isBelowMinStay;

        return (
            <div
                key={property.propertyId}
                className={`property-card ${!isMatch ? 'non-matching' : ''} ${isBlocked ? 'blocked' : ''}`}
                onClick={() => isMatch && !isBlocked && handlePropertyClick(property.propertyId)}
                style={isBlocked ? {pointerEvents: 'none'} : {}}
            >
                <div className="property-image-container" style={{position: 'relative'}}>
                    <img
                        src={property.pictureUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available'}
                        alt={property.name}
                        className="property-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                        }}
                    />
                    {!isMatch && <div className="non-matching-overlay">Doesn't match your criteria</div>}
                    {isBelowMinStay && (
                        <div className="blocked-banner"><span>Select more dates (min stay {property.minStay})</span></div>
                    )}
                    {property.available === false && (
                        <div className="blocked-banner"><span>Not available for selected dates</span></div>
                    )}
                    {property.collection && <span className="collection-badge">{property.collection}</span>}
                </div>

                <div className="property-details">
                    <h2 className="property-title">{property.name}</h2>
                    <p className="property-location">{property.city}, {property.state || property.region}, {property.country}</p>
                    <div className="property-specs">
                        <span>{property.bedrooms || 'N/A'} beds</span>
                        <span>{property.bathrooms || 'N/A'} baths</span>
                        <span>Sleeps {property.maxGuests || 'N/A'}</span>
                        {property.petsAllowed && <span>• Pets allowed</span>}
                    </div>
                    <div className="property-price">
                        ${property.pricePerNight || property.basePrice || 'N/A'} <span>/ night</span>
                    </div>
                    {!isMatch && (
                        <div className="mismatch-reasons">
                            {!matchesGuests && <span>Max guests: {property.maxGuests}</span>}
                            {!matchesPets && pets > 0 && <span>• No pets allowed</span>}
                        </div>
                    )}
                    {property.amenities && (
                        <div className="property-amenities">
                            {Array.isArray(property.amenities)
                                ? property.amenities.slice(0, 3).join(' · ')
                                : property.amenities}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-state">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
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
                        <select value={collectionOptions.find(opt => opt.label === filters.collection)?.value || ''} onChange={handleCollectionChange} className="filter-select">
                            {collectionOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort by:</label>
                        <select value={filters.sort} onChange={handleSortChange} className="filter-select">
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

                {showAdjustAlert && (
                    <div className="adjust-alert">
                        <div className="alert-content">
                            <h3>No properties match all your criteria</h3>
                            <p>Try adjusting your guest count or pet requirements, or browse similar properties below:</p>
                            <button onClick={() => setShowAdjustAlert(false)}>×</button>
                        </div>
                    </div>
                )}

                <div className="properties-grid">
                    {results
                        .slice()
                        .sort((a, b) => {
                            const searchParams = new URLSearchParams(location.search);
                            const adults = parseInt(searchParams.get('adults')) || 0;
                            const children = parseInt(searchParams.get('children')) || 0;
                            const pets = parseInt(searchParams.get('pets')) || 0;
                            const totalGuests = adults + children;

                            const getPriority = (prop) => {
                                const isAvailable = prop.available !== false && prop.meetsMinStay !== false;
                                const matchesGuests = prop.maxGuests >= totalGuests;
                                const matchesPets = pets === 0 || prop.petsAllowed;
                                const isMatching = matchesGuests && matchesPets;

                                if (isAvailable && isMatching) return 0;
                                if (!isAvailable && isMatching) return 1;
                                return 2;
                            };

                            return getPriority(a) - getPriority(b);
                        })
                        .map(renderPropertyCard)}
                </div>

                {results.length > 0 && (
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
                )}
            </main>
        </div>
    );
};

export default SearchResults;
