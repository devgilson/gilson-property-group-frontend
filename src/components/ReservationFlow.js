import { useState } from 'react';
import '../styles/ReservationFlow.css';

const ReservationFlow = ({ propertyDetails }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    propertyName: propertyDetails.name || '',
    propertyId: propertyDetails.id || '',
    checkIn: propertyDetails.selectedCheckIn || 'Sat July 1, 2025',
    checkOut: propertyDetails.selectedCheckOut || 'Sat July 31, 2025',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roomType: propertyDetails.selectedRoomType || '',
    basePrice: propertyDetails.basePrice || 0,
    taxes: propertyDetails.taxes || 0,
    fees: propertyDetails.fees || 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate total amount
    const totalAmount = reservationData.basePrice + reservationData.taxes + reservationData.fees;
    
    const finalReservationData = {
      ...reservationData,
      totalAmount,
      reservationDate: new Date().toISOString()
    };
    
    console.log('Final reservation data:', finalReservationData);
    // Here you would typically send this data to your backend API
  };

  return (
    <div className="reservation-flow">
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
      </div>
      
      <div className="step-indicator">
        Step {currentStep} of 4
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
          
          {/* Add-ons would go here */}
          <div className="add-ons">
            <h4>Available Add-ons</h4>
            {/* Example add-on */}
            <div className="add-on-item">
              <input type="checkbox" id="breakfast" name="breakfast" />
              <label htmlFor="breakfast">Daily Breakfast ($15/day)</label>
            </div>
            {/* More add-ons would be listed here */}
          </div>
          
          <div className="button-group">
            <button className="back-btn" onClick={handlePrevious}>Back</button>
            <button className="next-btn" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="step-content">
          <h2>Add protection</h2>
          
          <div className="protection-options">
            <div className="protection-option">
              <input type="radio" id="basicProtection" name="protection" defaultChecked />
              <label htmlFor="basicProtection">
                <h4>Basic Protection</h4>
                <p>Covers cancellation up to 24 hours before check-in</p>
                <p className="price">$10.00</p>
              </label>
            </div>
            
            <div className="protection-option">
              <input type="radio" id="premiumProtection" name="protection" />
              <label htmlFor="premiumProtection">
                <h4>Premium Protection</h4>
                <p>Full refund up to check-in time and damage coverage</p>
                <p className="price">$25.00</p>
              </label>
            </div>
          </div>
          
          <div className="button-group">
            <button className="back-btn" onClick={handlePrevious}>Back</button>
            <button className="next-btn" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      
      {currentStep === 4 && (
        <div className="step-content">
          <h2>Payment</h2>
          
          <div className="reservation-summary">
            <h3>Reservation Summary</h3>
            <div className="summary-item">
              <span>{reservationData.propertyName}</span>
              <span>${reservationData.basePrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Taxes</span>
              <span>${reservationData.taxes.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Fees</span>
              <span>${reservationData.fees.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>${(reservationData.basePrice + reservationData.taxes + reservationData.fees).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="payment-form">
            <h3>Payment Information</h3>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiration Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Name on Card</label>
              <input type="text" placeholder="John Doe" />
            </div>
          </div>
          
          <div className="button-group">
            <button className="back-btn" onClick={handlePrevious}>Back</button>
            <button className="submit-btn" onClick={handleSubmit}>Complete Reservation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationFlow;