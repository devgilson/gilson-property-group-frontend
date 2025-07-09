import React, { useState } from "react";
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";

const PaymentForm = ({ confirmationCode, bookingDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [message, setMessage] = useState("");

    React.useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: "US",
                currency: "usd",
                total: {
                    label: "Total",
                    amount: bookingDetails.totalAmount,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pr.canMakePayment().then(result => {
                if (result) setPaymentRequest(pr);
            });
        }
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...bookingDetails, confirmationCode }),
        });
        const { clientSecret } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            setMessage(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
            await fetch("/api/reservation/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...bookingDetails, confirmationCode }),
            });
            setMessage("✅ Booking confirmed!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {paymentRequest && <PaymentRequestButtonElement options={{ paymentRequest }} />}
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay</button>
            <p>{message}</p>
        </form>
    );
};

export default PaymentForm;
