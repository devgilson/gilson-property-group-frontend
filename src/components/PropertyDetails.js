import React, {useState, useEffect} from 'react';
import LoadingSpinner from './LoadingSpinner';
import {useParams, useNavigate, useSearchParams} from 'react-router-dom';
import filledStar from '../assets/review/filledstar.png';
import hollowStar from '../assets/review/hollowstar.png';
import defaultAvatar from '../assets/review/image1.png';
import QuickQuote from './QuickQuote';
import '../styles/PropertyDetails.css';

const StarRating = ({rating, small = false}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`star-rating ${small ? 'small' : ''}`}>
            {[...Array(fullStars)].map((_, i) => (
                <img key={`full-${i}`} src={filledStar} alt="★" className="star"/>
            ))}
            {hasHalfStar && (
                <div className="half-star-container">
                    <img src={filledStar} alt="½" className="star half-filled"/>
                    <img src={hollowStar} alt="☆" className="star half-hollow"/>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <img key={`empty-${i}`} src={hollowStar} alt="☆" className="star"/>
            ))}
        </div>
    );
};

const PropertyDetails = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [searchParams] = useSearchParams();
    const [property, setProperty] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [reviews, setReviews] = useState(null);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [quoteData, setQuoteData] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const initialCheckIn = searchParams.get('checkIn');
    const initialCheckOut = searchParams.get('checkOut');

    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [adults, setAdults] = useState(parseInt(searchParams.get('adults')) || 2);
    const [children, setChildren] = useState(parseInt(searchParams.get('children')) || 0);
    const [infants, setInfants] = useState(parseInt(searchParams.get('infants')) || 0);
    const [pets, setPets] = useState(parseInt(searchParams.get('pets')) || 0);
    const [showQuote, setShowQuote] = useState(false);


    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes(',')) {
            return dateStr;
        }
        const [year, month, day] = dateStr.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateStayDuration = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const fetchQuoteData = async () => {
        if (!checkIn || !checkOut) return;

        try {
            setQuoteLoading(true);
            setQuoteError(null);

            const response = await fetch(
                `${apiBaseUrl}/properties/${id}/quote`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        checkin_date: checkIn,
                        checkout_date: checkOut,
                        guests: {
                            adults: adults,
                            children: children,
                            infants: infants,
                            pets: pets
                        },
                        guest_details: {
                            first_name: "Test",
                            last_name: "User",
                            email: "test@gmail.com",
                            phone: "+12025550123"
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch quote');
            }

            const responseData = await response.json();

            if (!responseData.data?.data?.financials) {
                console.log('Received quote data structure:', responseData);
                throw new Error('Invalid quote data structure');
            }

            setQuoteData(responseData.data.data);

        } catch (err) {
            console.error('Quote fetch error:', err);
            setQuoteError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setQuoteLoading(false);
        }
    };

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                setLoading(true);
                setImageLoaded(false);

                const [propertyResponse, imagesResponse, nearbyResponse, reviewsResponse, amenitiesResponse] = await Promise.all([
                    fetch(`${apiBaseUrl}/properties/${id}`),
                    fetch(`${apiBaseUrl}/properties/${id}/images`),
                    fetch(`${apiBaseUrl}/properties/${id}/whats-around`),
                    fetch(`${apiBaseUrl}/properties/${id}/reviews`),
                    fetch(`${apiBaseUrl}/properties/${id}/amenities`)
                ]);

                if (!propertyResponse.ok) throw new Error('Property not found');
                if (!imagesResponse.ok) throw new Error('Failed to load property images');
                if (!reviewsResponse.ok) throw new Error('Failed to load reviews');
                if (!amenitiesResponse.ok) throw new Error('Failed to load amenities');

                const [propertyData, imageUrls, nearbyData, reviewsData, amenitiesData] = await Promise.all([
                    propertyResponse.json(),
                    imagesResponse.json(),
                    nearbyResponse.json(),
                    reviewsResponse.json(),
                    amenitiesResponse.json()
                ]);

                setProperty(propertyData);
                setImageUrls(imageUrls);
                setNearbyPlaces(nearbyData.nearbyPlaces || []);
                setReviews(reviewsData);
                setAmenities(amenitiesData);

                await fetchQuoteData();

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id, checkIn, checkOut]);
    const nextImage = () => {
        setImageLoaded(false);
        setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setImageLoaded(false);
        setCurrentImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    const selectImage = (index) => {
        if (index !== currentImageIndex) {
            setImageLoaded(false);
            setCurrentImageIndex(index);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const calculateRate = () => {
        if (!quoteData?.financials?.totals?.total?.amount) {
            return null;
        }

        const duration = calculateStayDuration();
        const totalAmount = quoteData?.financials.totals.total.amount / 100;

        if (duration >= 28) {
            return `$${(totalAmount / duration * 30).toFixed(2)} / month`;
        }

        return `$${(totalAmount / duration).toFixed(2)} / night`;
    };

    const handleReserveClick = () => {
        navigate('/reservation', {
            state: {
                propertyDetails: {
                    id: property.id,
                    name: property.name,
                    selectedCheckIn: checkIn,
                    selectedCheckOut: checkOut,
                    selectedRoomType: 'Entire property',
                    basePrice: quoteData?.financials?.totals?.sub_total?.amount ?
                        (quoteData?.financials.totals.sub_total.amount / 100) : 0,
                    taxes: quoteData?.financials?.totals?.total?.amount ?
                        (quoteData?.financials.totals.total.amount -
                            quoteData?.financials.totals.total_without_taxes?.amount) / 100 : 0,
                    fees: quoteData?.financials?.fees?.reduce((sum, fee) => sum + (fee.amount / 100), 0) || 0,
                    images: imageUrls,
                    amenities: amenities,
                    quoteData: quoteData
                }
            }
        });
    };

    const PricingSection = ({quote, nights}) => {
        if (!quote) return null;

        return (
            <div className="pricing-details">
                <div className="price-line">
                    <span>${quote.pricePerNight} × {nights} nights</span>
                    <span>${(quote.pricePerNight * nights).toFixed(2)}</span>
                </div>

                {quote.fees.map((fee, i) => (
                    <div className="price-line" key={i}>
                        <span>{fee.label}</span>
                        <span>{fee.formatted}</span>
                    </div>
                ))}

                <div className="total-price">
                    <span>Total</span>
                    <span>${quote.total}</span>
                </div>
            </div>
        );
    };

    const renderPaymentSection = () => {
        if (!checkIn || !checkOut) {
            return (
                <div className="payment-section">
                    <div className="payment-header">
                        <h3>Select dates to see pricing</h3>
                    </div>
                    <div className="payment-note">
                        Please choose check-in and check-out dates to view the total price.
                    </div>
                    <button className="check-price-button" onClick={() => setShowQuote(true)}>
                        Check Pricing
                    </button>
                    {showQuote && (
                        <QuickQuote
                            property={property}
                            onClose={() => setShowQuote(false)}
                            onSuccess={({ quote, checkIn: ci, checkOut: co, guests }) => {
                                setQuoteData(quote);
                                setCheckIn(ci);
                                setCheckOut(co);
                                setAdults(guests.adults);
                                setChildren(guests.children);
                                setInfants(guests.infants);
                                setPets(guests.pets);
                            }}
                        />
                    )}
                </div>
            );
        }

        if (quoteLoading) return <LoadingSpinner />;
        if (quoteError) return <div className="error">Error calculating price: {quoteError}</div>;
        if (!quoteData?.financials) return <div className="error">Price data not available</div>;

        const {
            total,
            total_without_taxes,
            sub_total
        } = quoteData?.financials.totals || {};

        const duration = calculateStayDuration();
        const pricePerNight = sub_total?.amount ? (sub_total.amount / 100 / duration).toFixed(2) : null;
        const monthlyRate = total?.amount ? (total.amount / 100 / duration * 30).toFixed(2) : null;

        return (
            <div className="payment-section">
                <div className="payment-header">
                    <h3>{`$${(total.amount / 100).toFixed(2)} / Total`}</h3>
                </div>

                <div className="payment-dates">
                    <div className="date-field">
                        <label>Check-in</label>
                        <div>{formatDisplayDate(checkIn)}</div>
                    </div>
                    <div className="date-field">
                        <label>Check-out</label>
                        <div>{formatDisplayDate(checkOut)}</div>
                    </div>
                    <div className="guest-field">
                        <label>Guests</label>
                        <div>
                            {adults} adult{adults !== 1 ? 's' : ''}
                            {children > 0 && `, ${children} child${children !== 1 ? 'ren' : ''}`}
                            {pets > 0 && `, ${pets} pet${pets !== 1 ? 's' : ''}`}
                        </div>
                    </div>
                </div>
                <div className="price-summary">
                    {sub_total?.amount && (
                        <div className="price-row">
                            <span>${pricePerNight} × {duration} nights</span>
                            <span>${(sub_total.amount / 100).toFixed(2)}</span>
                        </div>
                    )}

                    {quoteData?.financials.fees?.map((fee, index) => (
                        <div className="price-row" key={`fee-${index}`}>
                            <span>{fee.label}</span>
                            <span>{fee.formatted}</span>
                        </div>
                    ))}

                    {quoteData?.financials.taxes?.map((tax, index) => (
                        <div className="price-row" key={`tax-${index}`}>
                            <span>{tax.label}</span>
                            <span>{tax.formatted}</span>
                        </div>
                    ))}

                    {total_without_taxes?.amount && (
                        <div className="price-row">
                            <span>Total before taxes</span>
                            <span>${(total_without_taxes.amount / 100).toFixed(2)}</span>
                        </div>
                    )}

                    {total?.amount && (
                        <div className="price-row total-row">
                            <span>Total</span>
                            <span>${(total.amount / 100).toFixed(2)}</span>
                        </div>
                    )}

                    <div className="payment-note">
                        You won't be charged yet
                    </div>
                </div>

                <button className="reserve-button" onClick={handleReserveClick}>
                    Reserve Now
                </button>
            </div>
        );
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error">Error: {error}</div>;
    if (!property) return <div className="error">Property not found</div>;

    const visibleReviews = showAllReviews ? reviews.reviews : reviews.reviews.slice(0, 3);
    const averageRating = reviews ? reviews.averageRating : 0;
    const reviewCount = reviews ? reviews.totalItems : 0;

    return (
        <div className="property-page-container">
            <div className="property-header">
                <h1 className="property-name">{property.name}</h1>

                <div className="property-stats">
                    <span>{property.bedrooms} Beds</span>
                    <span>·</span>
                    <span>{property.bathrooms} Baths</span>
                    {property.garages && (
                        <>
                            <span>·</span>
                            <span>{property.garages} Garages</span>
                        </>
                    )}
                    {property.area && (
                        <>
                            <span>·</span>
                            <span>{property.area} sq ft</span>
                        </>
                    )}
                </div>

                <div className="property-location">
                    <span>{property.city}</span>,
                    <span> {property.state}</span>,
                    <span> {property.country}</span>
                </div>

                <div className="property-rating">
                    <StarRating rating={averageRating}/>
                    <span className="rating-text">
                        {averageRating.toFixed(1)} ({reviewCount} reviews)
                    </span>
                </div>
            </div>

            <div className="property-image-gallery">
                <div className="main-image-container">
                    {imageUrls.length > 0 ? (
                        <>
                            {!imageLoaded && <div className="image-loading"></div>}
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={`Property ${currentImageIndex + 1}`}
                                className="main-image"
                                loading="lazy"
                                onLoad={() => setImageLoaded(true)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                    setImageLoaded(true);
                                }}
                                style={{opacity: imageLoaded ? 1 : 0}}
                            />

                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        className="nav-button prev-button"
                                        onClick={prevImage}
                                        aria-label="Previous image"
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        className="nav-button next-button"
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        &gt;
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="no-images">No images available</div>
                    )}
                </div>

                {imageUrls.length > 1 && (
                    <div className="thumbnail-container">
                        {imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className={`thumbnail-wrapper ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => selectImage(index)}
                            >
                                <img
                                    src={url}
                                    alt={`Thumbnail ${index + 1}`}
                                    loading="lazy"
                                    className="thumbnail"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="property-content-container">
                <div className="property-details-content">
                    <div className="property-description">
                        <h2 className="section-title">About this property</h2>
                        <p>{property.summary || 'No description available'}</p>
                    </div>
                    {property.description && (
                        <div className="property-features" id="features-section">
                            <h2 className="section-title">Features</h2>
                            <ul className="features-list">
                                {property.description.split('\n')
                                    .filter(line => line.trim())
                                    .map((line, index) => {
                                        if (line.trim().startsWith('•') ||
                                            line.trim().startsWith('*') ||
                                            line.trim().startsWith('-')) {
                                            return (
                                                <li key={index} className="feature-item">
                                                    {line.trim().substring(1).trim()}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                            </ul>
                        </div>
                    )}

                    {amenities.length > 0 && (
                        <div className="amenities-section" id="amenities-section">
                            <h2 className="section-title">Amenities</h2>
                            <ul className="amenities-list">
                                {amenities.map((amenity, index) => (
                                    <li key={index} className="amenity-item">
                                        {amenity.item.split('_').slice(1).join(' ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="property-payment-sidebar">
                    <div className="pricing-scroll-boundary">
                        {renderPaymentSection()}
                    </div>
                </div>
            </div>

            {nearbyPlaces.length > 0 && (
                <div className="nearby-section">
                    <h2 className="section-title">What's Around</h2>
                    <div className="nearby-places-grid">
                        {nearbyPlaces.map((place) => (
                            <div key={place.id} className="nearby-place-card">
                                <div className="place-image-container">
                                    <img
                                        src={place.photoUrl}
                                        alt={place.name}
                                        className="place-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </div>
                                <div className="place-content">
                                    <h3 className="place-name">{place.name}</h3>
                                    <p className="place-description">{place.description}</p>
                                    <div className="place-distance">{place.distance}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {reviews && reviews.reviews.length > 0 && (
                <div className="reviews-section">
                    <h2 className="section-title">Reviews ({reviewCount})</h2>
                    <div className="average-rating">
                        <StarRating rating={averageRating} />
                        <span>{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
                    </div>

                    <div className="reviews-grid">
                        {visibleReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-name">{review.platform} Guest</div>
                                        <div className="review-date">{formatDate(review.reviewedAt)}</div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                <div className="review-text">{review.reviewText}</div>

                                {/*<div className="detailed-ratings">*/}
                                {/*    {review.detailedRatings.map((rating) => (*/}
                                {/*        <div key={rating.type} className="rating-item">*/}
                                {/*            <span className="rating-type">{rating.type}:</span>*/}
                                {/*            <StarRating rating={rating.rating} small />*/}
                                {/*        </div>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
                            </div>
                        ))}
                    </div>

                    {reviews.reviews.length > 3 && (
                        <button
                            className="show-more-button"
                            onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                            {showAllReviews ? 'Show Less' : 'Show All Reviews'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;