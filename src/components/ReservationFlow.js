import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReservationFlow.css';
import { useAuth } from './../context/AuthContext';
import { blockDates } from '../services/api';
import StripeWrapper from "./StripeWrapper";
import CheckoutForm from "./CheckoutForm";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ReservationFlow = ({ propertyDetails }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { currentUser, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState({
    propertyName: propertyDetails.name || '',
    propertyId: propertyDetails.id || '',
    checkIn: propertyDetails.selectedCheckIn || 'Sat July 1, 2025',
    checkOut: propertyDetails.selectedCheckOut || 'Sat July 31, 2025',
    firstName: 'John',
    lastName: 'Dale',
    email: 'johndale@gmail.com',
    phoneNumber: '(123) 456-7890',
    roomType: propertyDetails.selectedRoomType || '',
    basePrice: propertyDetails.basePrice || 0,
    taxes: propertyDetails.taxes || 0,
    fees: propertyDetails.fees || 0,
    addOns: []
  });

  // Available add-ons
  const availableAddOns = [
    { id: 1, name: 'Housekeeping', options: ['Daily', 'Weekly', 'Bi-weekly'], price: 100 },
    { id: 2, name: 'Spa Services', price: 150 },
    { id: 3, name: 'Private Chef', price: 200 },
    { id: 4, name: 'Grocery Delivery', price: 50 },
    { id: 5, name: 'Baby Equipment Rental', price: 75 },
    { id: 6, name: 'Guided Tour', price: 100 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOnChange = (addOnId, option = null) => {
    setReservationData(prev => {
      const existingIndex = prev.addOns.findIndex(item => item.id === addOnId);

      if (existingIndex >= 0) {
        // Remove if already exists
        const updatedAddOns = [...prev.addOns];
        updatedAddOns.splice(existingIndex, 1);
        return { ...prev, addOns: updatedAddOns };
      } else {
        // Add new
        const addOn = availableAddOns.find(item => item.id === addOnId);
        const newAddOn = {
          id: addOn.id,
          name: addOn.name,
          price: addOn.price,
          option: option
        };
        return { ...prev, addOns: [...prev.addOns, newAddOn] };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };


  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // In ReservationFlow.js
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Prepare dates to block (YYYY-MM-DD format)
      const startDate = new Date(reservationData.checkIn);
      const endDate = new Date(reservationData.checkOut);
      const dateStrings = [];

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dateStrings.push(date.toISOString().split('T')[0]);
      }

      // 2. Calculate price per night and min stay from quote data
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const pricePerNight = reservationData.basePrice / duration;
      const minStay = propertyDetails.quoteData?.financials?.min_stay || 1;

      // 3. Block dates with dynamic pricing
      const blockResult = await blockDates(
          propertyDetails.id,
          dateStrings,
          'RESERVATION',
          pricePerNight,
          minStay
      );

      if (!blockResult.success) {
        throw new Error('Failed to block dates');
      }

      // 4. Prepare complete booking data
      const addOnsTotal = reservationData.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
      const totalAmount = reservationData.basePrice + reservationData.taxes + reservationData.fees + addOnsTotal;

      // 5. Navigate to confirmation with all data
      navigate('/booking-confirmation', {
        state: {
          bookingData: {
            ...reservationData,
            bookingId: `TEMP-${Date.now()}`, // Will be replaced with real ID from backend
            totalAmount,
            datesBlocked: dateStrings.length,
            guestCount: {
              adults: propertyDetails.quoteData?.guests?.adults || 1,
              children: propertyDetails.quoteData?.guests?.children || 0,
              pets: propertyDetails.quoteData?.guests?.pets || 0
            }
          }
        }
      });

    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  const generateTempPassword = () => {
    return Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10);
  };

  const Loader = () => (
      <div className="loader-overlay">
        <div className="loader-spinner"></div>
        <p>Processing your reservation...</p>
      </div>
  );

  // Error message component
  const ErrorMessage = ({ message, onRetry }) => (
      <div className="error-message">
        <div className="error-icon">!</div>
        <div className="error-content">
          <p>{message}</p>
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
  );

  return (
    <div className="reservation-flow">

      {loading && <Loader />}

      {error && (
          <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
          />
      )}
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <div className="step-indicator">
        Step {currentStep} of 3
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <h2>Reserve your stay</h2>

          <div className="property-summary">
            <h3>{reservationData.propertyName}</h3>
            {reservationData.roomType && <p>Room Type: {reservationData.roomType}</p>}
            <div className="price-display">
              <span>Base Price: ${reservationData.basePrice.toFixed(2)}</span>
              {reservationData.taxes > 0 && <span>Taxes: ${reservationData.taxes.toFixed(2)}</span>}
              {reservationData.fees > 0 && <span>Fees: ${reservationData.fees.toFixed(2)}</span>}
            </div>
          </div>

          <div className="date-section">
            <div className="date-group">
              <label>Check in:</label>
              <div className="date-value">
                {reservationData.checkIn}
                <button className="edit-btn">Edit</button>
              </div>
            </div>

            <div className="date-group">
              <label>Check out:</label>
              <div className="date-value">
                {reservationData.checkOut}
                <button className="edit-btn">Edit</button>
              </div>
            </div>
          </div>

          <div className="contact-section">
            <h3>Contact Info</h3>

            <div className="name-group">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={reservationData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={reservationData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={reservationData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={reservationData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button
            className="next-btn"
            onClick={handleNext}
            disabled={!reservationData.firstName || !reservationData.lastName || !reservationData.email || !reservationData.phoneNumber}
          >
            Next
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-content">
          <h2>Customize your stay</h2>

          <div className="property-summary">
            <h3>{reservationData.propertyName}</h3>
            <p>Dates: {reservationData.checkIn} to {reservationData.checkOut}</p>
          </div>

          <div className="add-ons-section">
            <h4>Available Add-ons</h4>

            {availableAddOns.map(addOn => (
              <div key={addOn.id} className="add-on-item">
                <div className="add-on-header">
                  <input
                    type="checkbox"
                    id={`addon-${addOn.id}`}
                    checked={reservationData.addOns.some(item => item.id === addOn.id)}
                    onChange={() => handleAddOnChange(addOn.id)}
                  />
                  <label htmlFor={`addon-${addOn.id}`}>
                    <span className="add-on-name">{addOn.name}</span>
                    {addOn.price && <span className="add-on-price">${addOn.price}</span>}
                  </label>
                </div>

                {addOn.options && reservationData.addOns.some(item => item.id === addOn.id) && (
                  <div className="add-on-options">
                    {addOn.options.map(option => (
                      <div key={option} className="option-item">
                        <input
                          type="radio"
                          id={`option-${addOn.id}-${option}`}
                          name={`option-${addOn.id}`}
                          checked={reservationData.addOns.find(item => item.id === addOn.id)?.option === option}
                          onChange={() => handleAddOnChange(addOn.id, option)}
                        />
                        <label htmlFor={`option-${addOn.id}-${option}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="button-group">
            <button className="back-btn" onClick={handlePrevious}>Back</button>
            <button
                className="confirm-btn"
                onClick={handleNext}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
      {currentStep === 3 && (
          <div className="step-content">
            <h2>Payment</h2>
            <StripeWrapper reservationData={reservationData}>
              <CheckoutForm
                  reservationData={reservationData}
                  propertyDetails={propertyDetails}
              />
            </StripeWrapper>
            <div className="button-group">
              <button className="back-btn" onClick={handlePrevious}>Back</button>
            </div>
          </div>
      )}
    </div>
  );
};

export default ReservationFlow;