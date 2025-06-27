import React, { useState } from 'react';
import '../styles/Aboutpage.css';

// Slideshow Images
import slide1 from '../assets/aboutus/about_us_1.JPG';
import slide2 from '../assets/aboutus/about_us_2.JPG';
import slide3 from '../assets/aboutus/about_us_3.JPG';
import slide4 from '../assets/aboutus/about_us_4.JPG';
import slide5 from '../assets/aboutus/about_us_5.JPG';
import slide6 from '../assets/aboutus/about_us_6.jpg';

const slideImages = [slide1, slide2, slide3, slide4, slide5, slide6];

const Aboutpage = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((current + 1) % slideImages.length);
    };

    const prevSlide = () => {
        setCurrent((current - 1 + slideImages.length) % slideImages.length);
    };

    const goToSlide = (index) => {
        setCurrent(index);
    };

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero-section">
                <div className="about-hero-content">
                    <h1>We can keep what you have right now.</h1>

                    <div className="about-hero-slideshow-wrapper">
                        <div className="about-hero-slideshow">
                            <button className="prev" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
                            <img
                                src={slideImages[current]}
                                alt={`Slide ${current + 1}`}
                                className="about-hero-image"
                            />
                            <button className="next" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
                        </div>

                        <div className="about-thumbnail-container">
                            {slideImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`about-thumbnail ${index === current ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="about-mission-section">
                <h2>Our Mission</h2>
                <p>At The Gilson Group, we don’t just manage properties—we elevate them. With a deep-rooted passion for real estate, business, and technology, we understand how modern consumers engage with brands in the digital age.</p>
                <p>Our journey began in 2020 when founder Joshua Gilson Burton transformed his expertise in the music industry, corporate business, and real estate into a thriving venture.</p>
                <p>Our Colorado expansion was pivotal. Acquiring a 40-acre ranch in Fairplay solidified our presence in the Rockies. Now headquartered in downtown Breckenridge with over $35M in assets under management, we serve Summit, Park, and beyond.</p>
                <p>We treat every home like our own—with exceptional care, marketing, and revenue optimization.</p>
            </div>

            {/* Core Values */}
            <div className="about-core-values-section">
                <h2>Core Values</h2>
                <ul>
                    <li><strong>Integrity</strong> — Honest, accountable, and trustworthy in everything we do.</li>
                    <li><strong>Resilience</strong> — We meet challenges with grit and determination.</li>
                    <li><strong>Excellence in Service</strong> — We exceed expectations to deliver seamless experiences.</li>
                    <li><strong>Collaboration</strong> — Open communication and teamwork are key to success.</li>
                    <li><strong>Agility</strong> — We adapt quickly and innovate to stay ahead.</li>
                    <li><strong>Meaningful Connections</strong> — We build relationships that foster trust and growth.</li>
                </ul>
            </div>

            {/* Meet Our Team */}
            <div className="about-meet-our-team-section">
                <h2>Meet Our Team</h2>
                <ul>
                    <li><strong>Josh Burton</strong> – CEO & Founder</li>
                    <li><strong>Tom Burton</strong> – Founder Partner & Michigan Ops Manager</li>
                    <li><strong>Natalia Morales</strong> – Chief of Staff & Customer Experience Manager</li>
                    <li><strong>Michelle Pangilinan</strong> – Group Finance & Business Operations Manager</li>
                    <li><strong>Syed Rehaan</strong> – Dev/Ops Lead</li>
                    <li><strong>Chris Grino</strong> – Customer Experience Manager & Listing Administrator</li>
                    <li><strong>Kimberly Ann Tagnia</strong> – Database, Customer Experience & Listing Admin</li>
                    <li><strong>Claudia Perez</strong> – Service Delivery Lead</li>
                </ul>
            </div>

            {/* Join Our Community */}
            <div className="about-join-our-community-section">
                <h2>Join Our Community</h2>
                <p>Be part of our community. Stay updated with the latest news, events, and opportunities.</p>

                <div className="about-social-embed-grid">
                    <iframe src="https://www.instagram.com/p/DKhfvaFBDXa/embed" title="Instagram 1"></iframe>
                    <iframe src="https://www.instagram.com/p/DI1S15oTKWj/embed" title="Instagram 2"></iframe>
                    <iframe src="https://www.instagram.com/p/DIxN5J9x_aq/embed" title="Instagram 3"></iframe>
                </div>

                <div className="about-social-embed-grid">
                    <iframe src="https://www.tiktok.com/embed/v2/ZP8rqjkWf" title="TikTok 1"></iframe>
                    <iframe src="https://www.tiktok.com/embed/v2/ZP8rVtgPD" title="TikTok 2"></iframe>
                    <iframe src="https://www.tiktok.com/embed/v2/ZP8rVteEr" title="TikTok 3"></iframe>
                </div>

                <div className="about-social-embed-grid">
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/share/p/1aE3E1vsxq/" title="Facebook 1"></iframe>
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/share/p/1Hysge5jFY/" title="Facebook 2"></iframe>
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/share/p/1CAvECxPHL/" title="Facebook 3"></iframe>
                </div>
            </div>

            {/* Connect With Us */}
            <div className="about-connect-with-us-section">
                <h2>Connect with Us</h2>

                <div className="about-connect-single-column">
                    <div className="about-contact-item">
                        <span className="icon">📞</span>
                        <span>(123) 456-7890</span>
                    </div>
                    <div className="about-contact-item">
                        <span className="icon">📧</span>
                        <a href="mailto:hello@gilsonpropertygroup.com">
                            hello@gilsonpropertygroup.com
                        </a>
                    </div>
                    <div className="about-contact-item">
                        <span className="icon">💬</span>
                        <a href="#">Chat with us</a>
                    </div>

                    <p className="about-social-title">Follow us on</p>

                    <div className="about-social-links-single">
                        <div className="about-social-link-item">
                            <span className="icon">✨</span>
                            <a href="https://www.instagram.com/gilsonpropertygroup" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </div>
                        <div className="about-social-link-item">
                            <span className="icon">✨</span>
                            <a href="#">Social Media #2</a>
                        </div>
                        <div className="about-social-link-item">
                            <span className="icon">✨</span>
                            <a href="#">Social Media #3</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Aboutpage;
