import React from 'react';
import StripeWrapper from './StripeWrapper';
import CheckoutForm from './CheckoutForm';

const PaymentPage = () => (
    <StripeWrapper>
        <CheckoutForm />
    </StripeWrapper>
);

export default PaymentPage;
