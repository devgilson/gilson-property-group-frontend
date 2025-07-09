import React from 'react';
import { useLocation } from 'react-router-dom';
import StripeWrapper from './StripeWrapper';
import CheckoutForm from './CheckoutForm';
import '../styles/PaymentStep.css';

const PaymentPage = () => {
    const location = useLocation();
    const reservationData = location.state?.reservationData;
    const propertyDetails = location.state?.propertyDetails;

    if (!reservationData) {
        return (
            <div className="payment-step">
                <p>Reservation details not found.</p>
            </div>
        );
    }


    return (
        <div className="payment-step">
            <h2>Step 3: Payment</h2>

            <StripeWrapper reservationData={reservationData}>
                <CheckoutForm
                    reservationData={reservationData}
                    propertyDetails={propertyDetails}
                />
            </StripeWrapper>
        </div>
    );
};

export default PaymentPage;
