import React from 'react';
import '../styles/BreckenridgeExperience.css';

const BreckenridgeExperience = () => {
    return (
        <div className="breckenridge-experience">
            <h2 className="section-title">The Breckenridge Experience</h2>
            
            {/* First Section */}
            <div className="experience-section first-section">
                <div className="text-content left-20">
                    <h3 className="experience-subtitle">Enjoy world-class outdoor adventures</h3>
                    <p className="experience-text">
                        From skiing,<br/>
                        snowboarding, hiking,<br/>
                        biking, and more.
                    </p>
                </div>
                <div className="image-content right-80">
                    <img src={require('../assets/beone.jpg')} alt="Outdoor Adventures" className="section-image" />
                </div>
            </div>
            
            {/* Second Section */}
            <div className="experience-section second-section">
                <div className="image-content left-40">
                    <img src={require('../assets/betwo.png')} alt="Tavern" className="section-image" />
                </div>
                <div className="small-images-container middle-20">
                    <div className="small-image-wrapper">
                        <img src={require('../assets/bethree.png')} alt="Community" className="small-image" />
                    </div>
                    <div className="small-image-wrapper">
                        <img src={require('../assets/befour.png')} alt="More Activities" className="small-image" />
                    </div>
                </div>
                <div className="text-content right-20">
                    <h3 className="experience-subtitle">Explore the community</h3>
                    <p className="experience-text">
                        Take a stroll through the<br/>
                        historic Main Street.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BreckenridgeExperience;