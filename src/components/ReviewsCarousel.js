import React, { useState } from 'react';
import '../styles/ReviewsCarousel.css'; // Adjust the path as necessary
import starFilled from '../assets/review/filledstar.png';
import starHollow from '../assets/review/hollowstar.png';
import defaultAvatar from '../assets/review/image1.png';

const ReviewsCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedReview, setSelectedReview] = useState(null);
    const reviewsPerSlide = 3;

    const reviews = [
        {
            id: 1,
            author: "Floyd M.",
            text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
            rating: 5,
            image: require('../assets/review/image1.png')
        },
        {
            id: 2,
            author: "Ronald R.",
            text: "Ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            rating: 4,
            image: require('../assets/review/image2.png')
        },
        {
            id: 3,
            author: "Savannah N.",
            text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
            rating: 5,
            image: require('../assets/review/image3.png')
        }
    ];

    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);
    const transformValue = `translateX(-${currentSlide * 100}%)`;

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    const goToNextSlide = () => {
        setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const goToPrevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleReviewClick = (review) => {
        setSelectedReview(review);
    };

    const closeExpandedView = () => {
        setSelectedReview(null);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <img
                key={i}
                src={i < rating ? starFilled : starHollow}
                alt={i < rating ? "Filled star" : "Hollow star"}
                className="star-icon"
            />
        ));
    };

    return (
        <>
            {/* This will blur the entire homepage when a review is selected */}
            <div className={`homepage-blur ${selectedReview ? 'active' : ''}`}></div>

            {/* Expanded Review Modal - positioned fixed over everything */}
            {selectedReview && (
                <div className="expanded-review-modal">
                    <div className="expanded-review-content">
                        <div className="review-stars">
                            {renderStars(selectedReview.rating)}
                        </div>
                        <p className="review-text">{selectedReview.text}</p>
                        <div className="review-divider"></div>
                        <div className="review-footer">
                            <img
                                src={selectedReview.image || defaultAvatar}
                                alt={selectedReview.author}
                                className="review-avatar"
                            />
                            <h3 className="review-author">{selectedReview.author}</h3>
                        </div>
                        <button 
                            className="close-review-button"
                            onClick={() => setSelectedReview(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Original Carousel */}
            <div className={`reviews-section ${selectedReview ? 'blurred' : ''}`}>
                <h2 className="reviews-title">What Our Guests Say</h2>

                {selectedReview ? (
                    <div className="expanded-review-overlay">
                        <div className="expanded-review-container">
                            <div className="expanded-review-card">
                                <div className="review-stars">
                                    {renderStars(selectedReview.rating)}
                                </div>
                                <p className="review-text">{selectedReview.text}</p>
                                <div className="review-divider"></div>
                                <div className="review-footer">
                                    <img
                                        src={selectedReview.image || defaultAvatar}
                                        alt={selectedReview.author}
                                        className="review-avatar"
                                    />
                                    <h3 className="review-author">{selectedReview.author}</h3>
                                </div>
                                <button
                                    className="close-review-button"
                                    onClick={closeExpandedView}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="reviews-carousel-container">
                            <button
                                className="carousel-button prev"
                                onClick={goToPrevSlide}
                                aria-label="Previous reviews"
                            >
                                &lt;
                            </button>

                            <div className="reviews-carousel">
                                <div className="review-cards-wrapper" style={{ transform: transformValue }}>
                                    {reviews.map((review) => (
                                        <div
                                            className="review-card"
                                            key={review.id}
                                            onClick={() => handleReviewClick(review)}
                                        >
                                            <div className="review-header">
                                                <img
                                                    src={review.image || defaultAvatar}
                                                    alt={review.author}
                                                    className="review-avatar"
                                                />
                                                <div className="review-author-container">
                                                    <h3 className="review-author">{review.author}</h3>
                                                    <div className="review-stars">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="review-text">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="carousel-button next"
                                onClick={goToNextSlide}
                                aria-label="Next reviews"
                            >
                                &gt;
                            </button>
                        </div>

                        <div className="carousel-dots">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ReviewsCarousel;