import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getQuote } from '../services/api';
import '../styles/QuickQuote.css';

const QuickQuote = ({ property, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState({ adults: 1, children: 0 });
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleNext = async () => {
        if (step === 3) {
            if (!checkIn || !checkOut) return;
            try {
                setLoading(true);
                setError(null);
                const data = await getQuote(
                    property.propertyId || property.id,
                    checkIn.toISOString().split('T')[0],
                    checkOut.toISOString().split('T')[0],
                    { adults: guests.adults, children: guests.children, infants: 0, pets: 0 }
                );
                const quoteInfo = data.data ? data.data : data;
                setQuote(quoteInfo.financials);
                if (onSuccess) {
                    onSuccess({
                        quote: quoteInfo,
                        checkIn: checkIn.toISOString().split('T')[0],
                        checkOut: checkOut.toISOString().split('T')[0],
                        guests: { ...guests, infants: 0, pets: 0 }
                    });
                }
                setStep(4);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1 && step < 4) setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="qq-step">
                        <h3>Select check-in</h3>
                        <DatePicker selected={checkIn} onChange={setCheckIn} inline />
                    </div>
                );
            case 2:
                return (
                    <div className="qq-step">
                        <h3>Select check-out</h3>
                        <DatePicker selected={checkOut} onChange={setCheckOut} inline minDate={checkIn || new Date()} />
                    </div>
                );
            case 3:
                return (
                    <div className="qq-step">
                        <h3>Guests</h3>
                        <div className="guest-row">
                            <span>Adults</span>
                            <div className="guest-count">
                                <button onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}>-</button>
                                <span>{guests.adults}</span>
                                <button onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}>+</button>
                            </div>
                        </div>
                        <div className="guest-row">
                            <span>Children</span>
                            <div className="guest-count">
                                <button onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}>-</button>
                                <span>{guests.children}</span>
                                <button onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}>+</button>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                if (loading) return <div className="qq-step">Loading...</div>;
                if (error) return <div className="qq-step error">{error}</div>;
                if (!quote) return null;
                const total = quote.totals?.total?.amount ? (quote.totals.total.amount / 100).toFixed(2) : 'N/A';
                return (
                    <div className="qq-step">
                        <h3>Total Price</h3>
                        <p>${total}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="quote-modal-overlay" onClick={onClose}>
            <div className="quote-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                {renderStep()}
                <div className="quote-buttons">
                    {step > 1 && step < 4 && <button onClick={handlePrev}>Back</button>}
                    {step < 4 && <button onClick={handleNext}>{step === 3 ? 'Show Price' : 'Next'}</button>}
                </div>
            </div>
        </div>
    );
};

export default QuickQuote;