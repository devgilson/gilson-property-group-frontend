import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const StripeWrapper = ({ children }) => {
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        const fetchKey = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/stripe/publishable-key`);
            setStripePromise(loadStripe(response.data.publishableKey));
        };
        fetchKey();
    }, []);

    if (!stripePromise) return <p>Loading Stripe...</p>;

    return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
