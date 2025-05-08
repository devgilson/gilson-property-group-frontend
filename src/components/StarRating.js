import React from 'react';
import '../styles/StarRating.css';
import filledStar from '../assets/review/filledstar.png';
import hollowStar from '../assets/review/hollowstar.png';

const StarRating = ({ rating, small = false }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`star-rating ${small ? 'small' : ''}`}>
            {[...Array(fullStars)].map((_, i) => (
                <img key={`full-${i}`} src={filledStar} alt="Filled star" className="star" />
            ))}
            
            {hasHalfStar && (
                <div className="half-star-container">
                    <img src={filledStar} alt="Half filled star" className="star half-filled" />
                    <img src={hollowStar} alt="Half hollow star" className="star half-hollow" />
                </div>
            )}
            
            {[...Array(emptyStars)].map((_, i) => (
                <img key={`empty-${i}`} src={hollowStar} alt="Hollow star" className="star" />
            ))}
        </div>
    );
};

export default StarRating;