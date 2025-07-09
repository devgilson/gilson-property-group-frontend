import React, { useEffect, useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
    PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { blockDates } from '../services/api';
import '../styles/CheckoutForm.css';

const CheckoutForm = ({ reservationData, propertyDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentRequest, setPaymentRequest] = useState(null);

    const totalAmount =
        reservationData.basePrice +
        reservationData.taxes +
        reservationData.fees +
        reservationData.addOns.reduce((sum, addOn) => sum + addOn.price, 0);

    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: {
                    label: 'Total',
                    amount: Math.round(totalAmount * 100),
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pr.canMakePayment().then((result) => {
                if (result) setPaymentRequest(pr);
            });
        }
    }, [stripe, totalAmount]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/booking-confirmation`,
            },
            redirect: 'if_required',

        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const start = new Date(reservationData.checkIn);
                const end = new Date(reservationData.checkOut);
                const dates = [];
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    dates.push(d.toISOString().split('T')[0]);
                }

                const duration = Math.ceil(
                    (end - start) / (1000 * 60 * 60 * 24)
                );
                const pricePerNight = reservationData.basePrice / duration;
                const minStay =
                    propertyDetails?.quoteData?.financials?.min_stay || 1;

                await blockDates(
                    reservationData.propertyId,
                    dates,
                    'RESERVATION',
                    pricePerNight,
                    minStay
                );
            } catch (err) {
                console.error('Failed to block dates:', err);
            }
            setLoading(false);
            navigate('/booking-confirmation', {
                state: {
                    bookingData: {
                        ...reservationData,
                        bookingId: paymentIntent.id,
                        totalAmount,
                        status: 'paid',
                    },
                },
            });
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-form">
            <form onSubmit={handleSubmit}>
                {paymentRequest && (
                    <PaymentRequestButtonElement
                        options={{ paymentRequest }}
                        className="pr-button"
                    />
                )}
                <PaymentElement />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={!stripe || loading}>
                    {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
