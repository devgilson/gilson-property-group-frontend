import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/BookingConfirmation.css';
import successIcon from '../assets/confirmation/success.png';
import googleIcon from '../assets/confirmation/google icon.png';
import appleIcon from '../assets/confirmation/apple icon.png';

const BookingConfirmation = () => {
  const { state } = useLocation();

  if (!state?.bookingData) {
    return (
        <div className="error-container">
          <div className="error-message">
            <h2>Error: No booking data found</h2>
            <p>Please start your reservation from the property page.</p>
            <a href="/" className="return-home">Return to Home</a>
          </div>
        </div>
    );
  }

  const { bookingData } = state;
  const addOnsTotal = bookingData.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const totalAmount = bookingData.basePrice + bookingData.taxes + bookingData.fees + addOnsTotal;

  return (
      <div className="booking-confirmation">
        <header className="header">
          <div className="logo">GILSON PROPERTY GROUP</div>
          <nav className="nav">
            <a href="/management">Management</a>
            <a href="/about">About Us</a>
          </nav>
        </header>

        <main className="main-content">
          <div className="confirmation-success-icon">
            <img src={successIcon} alt="Success" />
          </div>

          <h1>You're all set!</h1>
          <p className="booking-id">Booking ID: {bookingData.bookingId}</p>

          <div className="blocking-confirmation success-message">
            <img src={successIcon} alt="Success" className="success-icon" />
            <p>Successfully reserved {bookingData.datesBlocked} nights from {bookingData.checkIn} to {bookingData.checkOut}</p>
          </div>

          <div className="payment-notice">
            <p>
              Timely payments are required to maintain your booking. Future payments will be automatically
              charged to your original payment method on the scheduled due dates. Missed payments will
              result in cancellation with no refunds.
            </p>
            <p>Need to update your booking? Create an account.</p>
            <div className="auth-options">
              <button className="auth-btn email">Sign up via email</button>
              <button className="auth-btn google">
                <img src={googleIcon} alt="Google" />
                Sign up with Google
              </button>
              <button className="auth-btn apple">
                <img src={appleIcon} alt="Apple" />
                Sign in with Apple
              </button>
            </div>
          </div>

          <div className="details-section">
            <div className="payment-details">
              <h2>Payment Details</h2>
              <div className="payment-item">
                <span>Accommodations</span>
                <span>${bookingData.basePrice.toFixed(2)}</span>
              </div>

              {bookingData.addOns.map((addOn, index) => (
                  <div key={index} className="payment-item">
                    <span>{addOn.name}{addOn.option ? ` - ${addOn.option}` : ''}</span>
                    <span>${addOn.price.toFixed(2)}</span>
                  </div>
              ))}

              <div className="payment-item">
                <span>Taxes</span>
                <span>${bookingData.taxes.toFixed(2)}</span>
              </div>
              <div className="payment-item">
                <span>Fees</span>
                <span>${bookingData.fees.toFixed(2)}</span>
              </div>
              <div className="payment-total">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="property-details">
              <h2>{bookingData.propertyName}</h2>
              <div className="date-item">
                <span>Check in:</span>
                <span>{bookingData.checkIn}</span>
              </div>
              <div className="date-item">
                <span>Check out:</span>
                <span>{bookingData.checkOut}</span>
              </div>
              <div className="guest-summary">
                <span>Guests:</span>
                <span>
                {bookingData.guestCount?.adults || 1} adult{bookingData.guestCount?.adults !== 1 ? 's' : ''}
                  {bookingData.guestCount?.children ? `, ${bookingData.guestCount.children} child${bookingData.guestCount.children !== 1 ? 'ren' : ''}` : ''}
                  {bookingData.guestCount?.pets ? `, ${bookingData.guestCount.pets} pet${bookingData.guestCount.pets !== 1 ? 's' : ''}` : ''}
              </span>
              </div>
            </div>
          </div>

          <div className="add-ons">
            <h2>Add-ons</h2>
            {bookingData.addOns.length > 0 ? (
                bookingData.addOns.map((addOn, index) => (
                    <div key={index} className="add-on-item">
                      <span>{addOn.name} {addOn.option || ''}</span>
                      <span>${addOn.price.toFixed(2)}</span>
                    </div>
                ))
            ) : (
                <p className="no-addons">No add-ons selected</p>
            )}
          </div>
        </main>
      </div>
  );
};

export default BookingConfirmation;