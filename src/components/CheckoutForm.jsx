import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CheckoutForm.css';

const CheckoutForm = ({ reservationData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const totalAmount =
        reservationData.basePrice +
        reservationData.taxes +
        reservationData.fees +
        reservationData.addOns.reduce((sum, addOn) => sum + addOn.price, 0);

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/stripe/create-payment-intent`, {
                    amount: Math.round(totalAmount * 100), // in cents
                    confirmationCode: `TEMP-${Date.now()}`
                });
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                setError('Failed to initialize payment.');
            }
        };

        createPaymentIntent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: `${reservationData.firstName} ${reservationData.lastName}`,
                    email: reservationData.email
                }
            }
        });

        if (result.error) {
            setError(result.error.message);
            setLoading(false);
        } else if (result.paymentIntent.status === 'succeeded') {
            navigate('/booking-confirmation', {
                state: {
                    bookingData: {
                        ...reservationData,
                        bookingId: result.paymentIntent.id,
                        totalAmount,
                        status: 'paid'
                    }
                }
            });
        }
    };

    return (
        <div className="checkout-form">
            <form onSubmit={handleSubmit}>
                <label>Enter Card Details</label>
                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={!stripe || loading}>
                    {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
