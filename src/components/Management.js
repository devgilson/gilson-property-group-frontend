import React, { useState } from 'react';
import '../styles/Management.css';
import homeCollectionImage from '../assets/homecollection.png';

const Management = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [homeCollectionImage, homeCollectionImage, homeCollectionImage, homeCollectionImage];

    const handleNext = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="management-page">
            <h1 className="heading">Luxury Property Management</h1>
            <p className="content">
                Welcome to The Gilson Group, Breckenridge’s premier luxury property management firm. We go beyond the ordinary—delivering seamless, high-touch estate management that ensures your investment is not just maintained, but maximized.
            </p>
            <div className="slideshow">
                <button className="nav-button left" onClick={handlePrev}>❮</button>
                <img src={images[currentImage]} alt="Slideshow" className="main-image" />
                <button className="nav-button right" onClick={handleNext}>❯</button>
                <div className="preview">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className={`preview-image ${index === currentImage ? 'active' : ''}`}
                            onClick={() => setCurrentImage(index)}
                        />
                    ))}
                </div>
            </div>
            <button className="cta-button">Request a projection</button>

            <h2 className="subheading">Client Benefits</h2>
            <div className="benefits">
                <div className="benefit">
                    <h3>No Markups on Service & Repairs</h3>
                    <p>At Gilson Group, transparency is at the core of our partnership. Unlike other management firms, we never inflate service or repair fees. You pay only for what’s necessary—no hidden costs, no unnecessary markups—ensuring your investment remains as profitable as possible.</p>
                </div>
                <div className="benefit">
                    <h3>No Annual Linen Fee</h3>
                    <p>Luxury should be seamless, not nickel-and-dimed. At Gilson Group, we don’t charge annual linen fees because we believe that pristine comfort and impeccable cleanliness should be a given, not an added expense.</p>
                </div>
                <div className="benefit">
                    <h3>Fair & Transparent Cleaning Fees</h3>
                    <p> Exceptional hospitality begins with uncompromising cleanliness. Our pass-through cleaning fees are both reasonable and reflective of the elevated standards we uphold—ensuring your property is maintained to perfection without inflated costs.</p>
                </div>
                <div className="benefit">
                    <h3>Earnings Paid Per Reservation</h3>
                    <p>Your investment should work for you—in real time. With Gilson Group, payouts are made per reservation, ensuring consistent and immediate returns on your luxury property. No delays, no waiting—just seamless earnings with every booking.</p>
                </div>
            </div>

            <h2 className="subheading">Our Exclusive Services</h2>
            <div className="services">
                <div className="service">
                    <h3>Elite Marketing & Revenue Optimization</h3>
                    <p>Your luxury home deserves a premium audience. We leverage high-impact marketing strategies, professional photography, and dynamic pricing to maximize exposure and elevate your earning potential—ensuring your property stands out in a competitive market.</p>
                </div>
                <div className="service">
                    <h3>White-Glove Customer Experience</h3>
                    <p>Excellence is our standard. With 24/7 guest and owner support, we provide immediate assistance via our dedicated call center and messaging channels. From last-minute requests to urgent concerns, we ensure every need is met with efficiency and discretion.</p>
                </div>
                <div className="service">
                    <h3>Proactive Property Maintenance</h3>
                    <p>Luxury homes require expert care. We manage routine maintenance, seasonal upkeep, and property enhancements with a network of top-tier vendors and in-house specialists—preserving your estate’s elegance and value.</p>
                </div>
                <div className="service">
                    <h3>Meticulous Inspections & Reporting</h3>
                    <p>Flawless stays start with rigorous oversight. We conduct pre- and post-stay inspections, bi-annual top-to-bottom assessments, and monthly performance reports—identifying opportunities for enhancement and ensuring seamless operations year-round.</p>
                </div>
                <div className="service">
                    <h3>Exclusive Owner Benefits</h3>
                    <p>Your time at your property should be effortless. Let us know what you need—from pre-arrival groceries to custom home preparations—so every stay feels like a five-star retreat, tailored just for you.</p>
                </div>
                <div className="service">
                    <h3>Comprehensive Protection & Security</h3>
                    <p>Your investment deserves unwavering oversight. We manage insurance coverages, tax collections, inventory monitoring, and guest screenings—protecting your property’s integrity while ensuring full compliance and security throughout every season.</p>
                </div>
                <div className="service">
                    <h3>Luxury Hospitality & Concierge Services</h3>
                    <p>We don’t just offer stays—we curate unparalleled experiences. From private chefs and spa treatments to adventure tours and mindfulness retreats, we elevate guest stays into extraordinary getaways, ensuring glowing reviews and repeat bookings.</p>
                </div>
                <div className="service">
                    <h3>Effortless Estate Project Management</h3>
                    <p>Transforming your luxury home should be exciting, not exhausting. From renovations to bespoke enhancements, we handle every detail—coordinating vendors, managing timelines, and ensuring flawless execution. With expert oversight and meticulous attention to detail, we turn your vision into reality while you enjoy complete peace of mind.</p>
                </div>
            </div>

            <h2 className="subheading">[Section for Brokers]</h2>

            <h2 className="subheading">Have Questions?</h2>
            <button className="cta-button">Request a consultation</button>
        </div>
    );
};

export default Management;