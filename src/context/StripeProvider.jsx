import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = fetch("/api/stripe/publishable-key")
    .then(res => res.json())
    .then(data => loadStripe(data.publishableKey));

const StripeProvider = ({ children }) => {
    const [stripe, setStripe] = React.useState(null);

    React.useEffect(() => {
        stripePromise.then(setStripe);
    }, []);

    if (!stripe) return null;
    return <Elements stripe={stripe}>{children}</Elements>;
};

export default StripeProvider;
