import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const StripeWrapper = ({ children, reservationData }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const initStripe = async () => {
            const keyRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/stripe/publishable-key`);
            setStripePromise(loadStripe(keyRes.data.publishableKey));

            const totalAmount =
                reservationData.basePrice +
                reservationData.taxes +
                reservationData.fees +
                reservationData.addOns.reduce((sum, a) => sum + a.price, 0);

            const intentRes = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/stripe/create-payment-intent`,
                {
                    amount: Math.round(totalAmount * 100),
                    confirmationCode: `TEMP-${Date.now()}`,
                }
            );
            setClientSecret(intentRes.data.clientSecret);
        };
        initStripe();
    }, []);

    if (!stripePromise || !clientSecret) return <p>Loading Stripe...</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            {children}
        </Elements>
    );
};

export default StripeWrapper;
