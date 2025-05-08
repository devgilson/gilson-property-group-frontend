import React from 'react';
import '../styles/Aboutpage.css';
import officeImage from '../assets/aboutusslide.png';
import Header from './Header';
import Footer from './Footer';

const Aboutpage = () => {
    return (
        <div className="about-page" style={{ backgroundColor: '#F5ECE2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div className="about-hero-section" style={{ flex: '1' }}>
                <div className="hero-content">
                    <h1>We can keep what you have right now.</h1>
                    <div className="hero-slideshow">
                        <img src={officeImage} alt="Office Slideshow" className="hero-image" />
                        <p className="slideshow-caption">This will be a slideshow of the office</p>
                    </div>
                </div>
            </div>
            <div className="mission-section" style={{ color: '#5C3B2E' }}>
                <h2>Our Mission</h2>
                <p>
                    At The Gilson Group, we don’t just manage properties—we elevate them. With a deep-rooted passion for real estate, business, and technology, we understand how modern consumers engage with brands in the digital age.
                </p>
                <p>
                    Our journey began in 2020, when founder Joshua Gilson Burton transformed his expertise in the music industry, corporate business, and retail into a thriving real estate venture. What started as a family fix-and-flip project in Lansing, Michigan, has grown into a diverse portfolio of high-performing short-term, mid-term, and long-term rentals across Michigan and Colorado.
                </p>
                <p>
                    Our expansion into the Colorado Rockies was a game-changer. Acquiring a 40-acre ranch in Fairplay allowed us to establish a strong foothold in the market, applying strategic marketing and operational expertise to drive growth. Today, with a headquarters in downtown Breckenridge, a global team, and over $35 million in assets under management, we are a trusted partner for property owners across Summit, Park, and beyond.
                </p>
                <p>
                    What sets us apart? We don’t just manage properties—we invest in them. By treating every home as if it were our own, we provide unmatched care, strategic marketing, and revenue optimization to help our clients maximize their returns.
                </p>
                <p>
                    Whether you own a luxury mountain retreat or a city-based rental, The Gilson Group is here to help you unlock the full potential of your investment.
                </p>
            </div>
            <div className="core-values-section" style={{ color: '#5C3B2E' }}>
                <h2>Core Values</h2>
                <p>At The Gilson Group, our values drive everything we do—from managing properties to building lasting partnerships.</p>
                <ul>
                    <li><strong>Integrity</strong><br />We act with honesty, accountability, and a strong moral compass, earning the trust of our clients, guests, and team members.</li>
                    <li><strong>Resilience</strong><br />Challenges don’t slow us down—they make us stronger. We approach every obstacle with grit, determination, and a commitment to delivering exceptional results.</li>
                    <li><strong>Excellence in Service</strong><br />Going above and beyond is our standard. We anticipate needs, exceed expectations, and create seamless experiences for homeowners and guests alike.</li>
                    <li><strong>Collaboration</strong><br />Success is a team effort. We foster open communication, embrace diverse perspectives, and work together to achieve shared goals.</li>
                    <li><strong>Agility</strong><br />The market moves fast—and so do we. We stay ahead of trends, pivot strategically, and embrace innovation to maximize success.</li>
                    <li><strong>Meaningful Connections</strong><br />Success isn’t just about business—it’s about people. We cultivate strong relationships, build a positive work culture, and create an environment where everyone thrives.</li>
                </ul>
            </div>
            <div className="meet-our-team-section" style={{ color: '#5C3B2E' }}>
                <h2>Meet Our Team</h2>
                <ul>
                    <li><strong>Josh Burton</strong> – CEO & Founder</li>
                    <li><strong>Tom Burton</strong> - Founder Partner & Michigan Ops Manager</li>
                    <li><strong>Natalia Morales</strong> – Chief of Staff & Customer Experience Manager</li>
                    <li><strong>Michelle Pangilinan</strong> - Group Finance & Business Operations Manager</li>
                    <li><strong>Walter Orozco</strong> - Portfolio Field Operations Manager</li>
                    <li><strong>Syed Rehaan</strong> - Dev/Ops Lead</li>
                    <li><strong>Chris Grino</strong> – Database, Customer Experience & Listing Admin</li>
                    <li><strong>Phoebe Loseriaga</strong> - Database, Customer Experience & Listing Admin</li>
                    <li><strong>Claudia Perez</strong> – Service Delivery Lead</li>
                </ul>
            </div>
            <div className="join-our-community-section" style={{ color: '#5C3B2E', textAlign: 'center', marginTop: '40px' }}>
                <h2>Join Our Community</h2>
                <p>Be a part of our growing community and stay connected with the latest updates, events, and opportunities.</p>
                <img src={require('../assets/instapost.png')} alt="Join Our Community" style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '20px' }} />
            </div>
            <div className="connect-with-us-section">
                <h2>Connect with Us</h2>
                
                <div className="connect-info">
                    <div className="connect-info-item">
                        <span>📞</span> (123) 456-7890
                    </div>
                    <div className="connect-info-item">
                        <span>📧</span> <a href="mailto:hello@gilsonpropertygroup.com">hello@gilsonpropertygroup.com</a>
                    </div>
                    <div className="connect-info-item">
                        <span>💬</span> <a href="#">Chat with us</a>
                    </div>
                    </div>
                    
                    <div className="social-section">
                        <p className="social-title">Follow us on</p>
                        <ul className="social-links">
                            <li>
                                <a href="#">Instagram</a>
                            </li>
                            <li>
                                <a href="#">Social Media #2</a>
                            </li>
                            <li>
                                <a href="#">Social Media #3</a>
                            </li>
                        </ul>
                    </div>
                </div>
        </div>
    );
};

export default Aboutpage;