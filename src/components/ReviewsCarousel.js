import React, { useState, useEffect } from 'react';
import '../styles/ReviewsCarousel.css';
import filledStar from '../assets/review/filledstar.png';
import hollowStar from '../assets/review/hollowstar.png';
import defaultAvatar from '../assets/review/image1.png';

const ReviewsCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedReview, setSelectedReview] = useState(null);
    const reviewsPerSlide = 3;
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/properties/random?count=6`);
                const data = await res.json();
                setReviews(data || []);
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            }
        };

        fetchReviews();
    }, []);

    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);
    const transformValue = `translateX(-${currentSlide * 100}%)`;

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const empty = 5 - full;
        return (
            <>
                {[...Array(full)].map((_, i) => (
                    <img key={`f-${i}`} src={filledStar} alt="★" className="star-icon" />
                ))}
                {[...Array(empty)].map((_, i) => (
                    <img key={`e-${i}`} src={hollowStar} alt="☆" className="star-icon" />
                ))}
            </>
        );
    };

    const getSlides = () => {
        const slides = [];
        for (let i = 0; i < reviews.length; i += reviewsPerSlide) {
            slides.push(reviews.slice(i, i + reviewsPerSlide));
        }
        return slides;
    };

    const truncateText = (text) => {
        const maxLength = 260;
        return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
    };

    return (
        <>
            {selectedReview && (
                <div className="review-modal-overlay" onClick={() => setSelectedReview(null)}>
                    <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setSelectedReview(null)}>×</button>
                        <div className="review-modal-author">
                            <img src={defaultAvatar} alt="avatar" />
                            <div>airbnb Guest</div>
                            <div className="review-stars">{renderStars(selectedReview.rating)}</div>
                        </div>
                        <p className="review-modal-text">{selectedReview.reviewText}</p>
                    </div>
                </div>
            )}

            <section className="reviews-section">
                <h2 className="reviews-title">What Our Guests Say</h2>

                <div className="carousel-wrapper">
                    <button className="carousel-btn left" onClick={() => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))}>{'<'}</button>
                    <div className="carousel-container">
                        <div className="carousel-track" style={{ transform: transformValue }}>
                            {getSlides().map((group, index) => (
                                <div className="carousel-slide" key={index}>
                                    {group.map((review, i) => (
                                        <div className="review-card" key={i}>
                                            <div className="review-header">
                                                <img src={defaultAvatar} alt="avatar" />
                                                <div>
                                                    <div>airbnb Guest</div>
                                                    <div className="review-stars">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                            <div className="review-body">
                                                <p>{truncateText(review.reviewText)}</p>
                                                {review.reviewText.length > 260 && (
                                                    <button className="read-more" onClick={() => setSelectedReview(review)}>Read more</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="carousel-btn right" onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}>{'>'}</button>
                </div>

                <div className="carousel-dots">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${currentSlide === i ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>
            </section>
        </>
    );
};

export default ReviewsCarousel;
