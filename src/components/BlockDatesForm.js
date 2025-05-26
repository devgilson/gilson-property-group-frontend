import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blockDates } from '../services/api';
import '../styles/BlockDatesForm.css'; // You can create this new CSS file

const BlockDatesForm = ({ propertyDetails }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('MAINTENANCE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDateSelection = (dates) => {
        setSelectedDates(dates);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedDates.length === 0) {
            setError('Please select at least one date');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await blockDates(
                propertyDetails.id,
                selectedDates,
                reason
            );

            navigate('/booking-confirmation', {
                state: {
                    bookingData: {
                        propertyName: propertyDetails.name,
                        propertyId: propertyDetails.id,
                        dates: selectedDates.map(date => date.toISOString().split('T')[0]),
                        reason,
                        status: 'BLOCKED'
                    }
                }
            });
        } catch (err) {
            setError(err.message || 'Failed to block dates');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="block-dates-form">
            <h2>Block Dates for {propertyDetails.name}</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Date Picker Component - You'll need to implement or integrate this */}
            <div className="date-picker-container">
                {/* This would be your calendar component that calls handleDateSelection */}
                <p>Calendar component would go here</p>
                <p>Selected dates: {selectedDates.join(', ')}</p>
            </div>

            <div className="reason-selection">
                <label htmlFor="reason">Reason for blocking:</label>
                <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="PERSONAL_USE">Personal Use</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <button
                className="block-dates-button"
                onClick={handleSubmit}
                disabled={selectedDates.length === 0 || isLoading}
            >
                {isLoading ? 'Blocking Dates...' : 'Block Selected Dates'}
            </button>
        </div>
    );
};

export default BlockDatesForm;