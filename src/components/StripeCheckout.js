import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../services/api'; // axios instance

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ confirmationCode, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        async function createPaymentIntent() {
            const res = await api.post('/stripe/create-payment-intent', {
                confirmationCode,
                amount: amount * 100 // cents
            });
            setClientSecret(res.data.clientSecret);
        }
        createPaymentIntent();
    }, [confirmationCode, amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (result.error) {
            alert(`❌ Payment failed: ${result.error.message}`);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                alert('✅ Payment successful!');
                // Optional: call backend to save final booking
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay Now</button>
        </form>
    );
};

const StripeCheckout = ({ confirmationCode, amount }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm confirmationCode={confirmationCode} amount={amount} />
    </Elements>
);

export default StripeCheckout;
