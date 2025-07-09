import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('/api/stripe/publishable-key'); // This endpoint must return the publishable key

const CheckoutForm = ({ confirmationCode }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Payment succeeded!');
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                style={{ marginTop: '20px' }}
            >
                {isProcessing ? 'Processing…' : 'Pay now'}
            </button>
            {message && <div style={{ marginTop: '10px', color: 'red' }}>{message}</div>}
        </form>
    );
};

const PaymentStep = ({ confirmationCode, amount }) => {
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        axios
            .post('/api/stripe/create-payment-intent', {
                amount: amount, // amount in smallest currency unit (e.g., cents)
                currency: 'usd',
                confirmation_code: confirmationCode,
            })
            .then((res) => {
                setClientSecret(res.data.clientSecret);
            })
            .catch((err) => {
                console.error('Error creating PaymentIntent:', err);
            });
    }, [confirmationCode, amount]);

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm confirmationCode={confirmationCode} />
                </Elements>
            ) : (
                <div>Loading payment form...</div>
            )}
        </div>
    );
};

export default PaymentStep;
