import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const generateTempPassword = () => {
  return Math.random().toString(36).slice(-10) +
      Math.random().toString(36).slice(-10);
};

const handleGuestCheckout = async (bookingData) => {
    try {
        // 1. Auto-register guest user
        const registerResponse = await fetch('/api/auth/guest-register', {
                method: 'POST',
                body: JSON.stringify({
                    email: bookingData.email,
                    password: generateTempPassword(),
                    firstName: bookingData.firstName,
                    lastName: bookingData.lastName
                })
        });
    } catch (error) {
        console.error('Error during guest checkout:', error);
    }
};
