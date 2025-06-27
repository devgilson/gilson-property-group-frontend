import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../styles/PaymentStep.css';

const PaymentStep = ({ reservationData, onPaymentSuccess, onBack }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const totalAmount =
        reservationData.basePrice +
        reservationData.taxes +
        reservationData.fees +
        reservationData.addOns.reduce((sum, a) => sum + a.price, 0);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/stripe/create-payment-intent`, {
                    amount: totalAmount * 100,
                    confirmationCode: `TEMP-${Date.now()}`,
                });
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                console.error('Failed to create payment intent', err);
                setError('Failed to initialize payment. Please try again.');
            }
        };

        fetchClientSecret();
    }, [totalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setError('Stripe is not ready');
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${reservationData.firstName} ${reservationData.lastName}`,
                    email: reservationData.email,
                },
            },
        });

        if (result.error) {
            setError(result.error.message);
            setProcessing(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                onPaymentSuccess();
            } else {
                setError('Payment did not succeed. Please try again.');
            }
            setProcessing(false);
        }
    };

    return (
        <div className="payment-step">
            <h2>Step 3: Payment</h2>

            <div className="summary-box">
                <p>Total Amount: <strong>${totalAmount.toFixed(2)}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
                <label htmlFor="card-element">Enter your card information:</label>
                <CardElement id="card-element" options={{ hidePostalCode: true }} />

                {error && <p className="payment-error">{error}</p>}

                <div className="payment-actions">
                    <button type="button" className="back-btn" onClick={onBack} disabled={processing}>Back</button>
                    <button type="submit" className="pay-btn" disabled={!stripe || processing}>
                        {processing ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentStep;
