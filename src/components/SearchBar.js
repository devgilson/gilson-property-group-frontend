import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocations, getAvailabilityByState, getAvailability } from '../services/api';
import '../styles/SearchBar.css';

const SearchBar = () => {
    const navigate = useNavigate();

    // Refs for dropdown handling
    const locationRef = useRef(null);
    const dateRef = useRef(null);
    const guestRef = useRef(null);

    // State for UI controls
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);

    // State for search parameters
    const [location, setLocation] = useState('All locations');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [dates, setDates] = useState('Check-in → Check-out');
    const [guests, setGuests] = useState('2 guests');

    // State for calendar
    const [leftMonth, setLeftMonth] = useState(new Date());
    const [rightMonth, setRightMonth] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    });
    const [selectedDates, setSelectedDates] = useState({
        checkIn: null,
        checkOut: null
    });

    // State for guest counts
    const [guestCounts, setGuestCounts] = useState({
        adults: 2,
        children: 0,
        infants: 0,
        pets: 0
    });

    // State for data
    const [locations, setLocations] = useState([]);
    const [availability, setAvailability] = useState({
        availableDates: [],
        bookedDates: []
    });

    // Memoized availability sets for faster lookups
    const availabilityMaps = useMemo(() => ({
        available: new Set(availability.availableDates),
        booked: new Set(availability.bookedDates)
    }), [availability]);

    // Today's date for comparison (memoized)
    const today = useMemo(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }, []);

    // Fetch locations on mount
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    // Update guests display text
    useEffect(() => {
        const totalGuests = guestCounts.adults + guestCounts.children;
        setGuests(`${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`);
    }, [guestCounts]);

    // Update dates display text
    useEffect(() => {
        if (selectedDates.checkIn && selectedDates.checkOut) {
            const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            setDates(`${formatDate(selectedDates.checkIn)} → ${formatDate(selectedDates.checkOut)}`);
        } else if (selectedDates.checkIn) {
            const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            setDates(`${formatDate(selectedDates.checkIn)} → Check-out`);
        } else {
            setDates('Check-in → Check-out');
        }
    }, [selectedDates]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setShowDateDropdown(false);
            }
            if (guestRef.current && !guestRef.current.contains(event.target)) {
                setShowGuestDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch availability when location changes
    useEffect(() => {
        const abortController = new AbortController();

        const fetchAvailability = async () => {
            try {
                const todayStr = today.toISOString().split('T')[0];
                const endDate = new Date(today);
                endDate.setMonth(endDate.getMonth() + 6);
                const endDateStr = endDate.toISOString().split('T')[0];

                let data;
                if (selectedLocation === 'CO' || selectedLocation === 'MI') {
                    data = await getAvailabilityByState(selectedLocation, todayStr, endDateStr);
                } else if (selectedLocation) {
                    data = await getAvailability(selectedLocation, todayStr, endDateStr);
                } else {
                    data = { availableDates: [], bookedDates: [] };
                }

                setAvailability({
                    availableDates: data.availableDates || [],
                    bookedDates: data.bookedDates || []
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching availability:', error);
                    setAvailability({
                        availableDates: [],
                        bookedDates: []
                    });
                }
            }
        };

        fetchAvailability();
        return () => abortController.abort();
    }, [selectedLocation, today]);

    // Memoized calendar generation
    const generateCalendarDays = useCallback((month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i));
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        // Next month days
        const totalCells = Math.ceil(days.length / 7) * 7;
        const nextMonthDays = totalCells - days.length;
        for (let i = 1; i <= nextMonthDays; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    }, []);

    // Memoized date disabled check
    const isDateDisabled = useCallback((date) => {
        if (date < today) return true;
        if (!selectedLocation) return false;

        const dateStr = date.toISOString().split('T')[0];
        return !availabilityMaps.available.has(dateStr) ||
            availabilityMaps.booked.has(dateStr);
    }, [availabilityMaps, selectedLocation, today]);

    // Memoized date selection handlers
    const handleDateClick = useCallback((date, e) => {
        e.stopPropagation();
        if (date < today || isDateDisabled(date)) return;

        setSelectedDates(prev => {
            // Same date click logic
            if (prev.checkIn?.toDateString() === date.toDateString() && !prev.checkOut) {
                return { checkIn: null, checkOut: null };
            }

            // New selection logic
            if (!prev.checkIn || date < prev.checkIn) {
                return { checkIn: date, checkOut: null };
            }

            // Range validation logic
            if (prev.checkIn && !prev.checkOut) {
                let tempDate = new Date(prev.checkIn);
                tempDate.setDate(tempDate.getDate() + 1);
                let allValid = true;

                while (tempDate < date) {
                    const dateStr = tempDate.toISOString().split('T')[0];
                    if (!availabilityMaps.available.has(dateStr)) {
                        allValid = false;
                        break;
                    }
                    tempDate.setDate(tempDate.getDate() + 1);
                }

                return allValid
                    ? { ...prev, checkOut: date }
                    : { checkIn: date, checkOut: null };
            }

            return { checkIn: date, checkOut: null };
        });
    }, [availabilityMaps, isDateDisabled, today]);

    // Memoized calendar rendering
    const renderSingleCalendar = useCallback((monthDate, days) => {
        const month = monthDate.getMonth();
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const isDateSelected = (date) => {
            return (selectedDates.checkIn && date.toDateString() === selectedDates.checkIn.toDateString()) ||
                (selectedDates.checkOut && date.toDateString() === selectedDates.checkOut.toDateString());
        };

        const isDateInRange = (date) => {
            return selectedDates.checkIn && selectedDates.checkOut &&
                date > selectedDates.checkIn && date < selectedDates.checkOut;
        };

        return (
            <div className="calendar">
                <div className="calendar-weekdays">
                    {weekdays.map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>

                <div className="calendar-days">
                    {days.map((day, index) => {
                        const isCurrentMonth = day.getMonth() === month;
                        const disabled = !isCurrentMonth || isDateDisabled(day);
                        const selected = isDateSelected(day);
                        const inRange = isDateInRange(day);
                        const dateStr = day.toISOString().split('T')[0];
                        const isAvailable = availabilityMaps.available.has(dateStr);

                        return (
                            <div
                                key={index}
                                className={`calendar-day 
                                    ${!isCurrentMonth ? 'other-month' : ''}
                                    ${disabled ? 'disabled' : ''} 
                                    ${selected ? 'selected' : ''} 
                                    ${inRange ? 'in-range' : ''}
                                    ${isAvailable ? 'available' : ''}`}
                                onClick={(e) => !disabled && handleDateClick(day, e)}
                            >
                                {day.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [availabilityMaps, isDateDisabled, handleDateClick, selectedDates]);

    // Memoized calendar data
    const leftMonthDays = useMemo(() =>
            generateCalendarDays(leftMonth.getMonth(), leftMonth.getFullYear()),
        [generateCalendarDays, leftMonth]
    );

    const rightMonthDays = useMemo(() =>
            generateCalendarDays(rightMonth.getMonth(), rightMonth.getFullYear()),
        [generateCalendarDays, rightMonth]
    );

    // Event handlers
    const handleMonthChange = (increment, e) => {
        e.stopPropagation();
        const newLeftMonth = new Date(leftMonth);
        newLeftMonth.setMonth(newLeftMonth.getMonth() + increment);

        const newRightMonth = new Date(newLeftMonth);
        newRightMonth.setMonth(newRightMonth.getMonth() + 1);

        setLeftMonth(newLeftMonth);
        setRightMonth(newRightMonth);
    };

    const handleLocationSelect = (loc) => {
        setSelectedLocation(loc.id);
        setLocation(loc.name);
        setShowLocationDropdown(false);
    };

    const handleGuestChange = (type, operation, e) => {
        e.stopPropagation();
        setGuestCounts(prev => ({
            ...prev,
            [type]: Math.max(0, operation === 'increase' ? prev[type] + 1 : prev[type] - 1)
        }));
    };

    const handleSearch = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }

        const params = new URLSearchParams();
        if (selectedLocation) {
            if (selectedLocation === 'CO' || selectedLocation === 'MI') {
                params.append('state', selectedLocation);
            } else {
                params.append('location', selectedLocation);
            }
        }

        params.append('checkIn', selectedDates.checkIn.toISOString().split('T')[0]);
        params.append('checkOut', selectedDates.checkOut.toISOString().split('T')[0]);
        params.append('adults', guestCounts.adults);
        params.append('children', guestCounts.children);

        navigate(`/search/results?${params.toString()}`);
    };

    return (
        <div className="search-container">
            <div className="search-bar">
                {/* Location Dropdown */}
                <div
                    className="search-field"
                    ref={locationRef}
                    onClick={() => {
                        setShowLocationDropdown(!showLocationDropdown);
                        setShowDateDropdown(false);
                        setShowGuestDropdown(false);
                    }}
                >
                    <div className="search-value">{location}</div>
                    <div className="dropdown-arrow">⌄</div>

                    {showLocationDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-title">Select Location</div>
                            {locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className={`dropdown-item ${selectedLocation === loc.id ? 'selected' : ''}`}
                                    onClick={() => handleLocationSelect(loc)}
                                >
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Dropdown */}
                <div
                    className="search-field"
                    ref={dateRef}
                    onClick={() => {
                        setShowDateDropdown(!showDateDropdown);
                        setShowLocationDropdown(false);
                        setShowGuestDropdown(false);
                    }}
                >
                    <div className="search-value">{dates}</div>
                    <div className="dropdown-arrow">⌄</div>

                    {showDateDropdown && (
                        <div className="date-dropdown-menu">
                            <div className="dual-calendar">
                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>
                                            {leftMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(leftMonth, leftMonthDays)}
                                </div>

                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>
                                            {rightMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(rightMonth, rightMonthDays)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guest Dropdown */}
                <div
                    className="search-field guest-field"
                    ref={guestRef}
                    onClick={() => {
                        setShowGuestDropdown(!showGuestDropdown);
                        setShowLocationDropdown(false);
                        setShowDateDropdown(false);
                    }}
                >
                    <div className="search-value">{guests}</div>
                    <div className="dropdown-arrow">⌄</div>

                    {showGuestDropdown && (
                        <div className="guest-dropdown-menu">
                            {['adults', 'children', 'infants', 'pets'].map((type) => (
                                <div key={type} className="guest-option">
                                    <div>
                                        <div className="guest-label">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </div>
                                        <div className="guest-subtext">
                                            {type === 'adults' ? 'Age 13+' :
                                                type === 'children' ? 'Ages 2 to 12' :
                                                    type === 'infants' ? 'Under 2' :
                                                        'Not including service animals'}
                                        </div>
                                    </div>
                                    <div className="guest-counter">
                                        <button
                                            onClick={(e) => handleGuestChange(type, 'decrease', e)}
                                            disabled={guestCounts[type] <= (type === 'adults' ? 1 : 0)}
                                        >
                                            -
                                        </button>
                                        <span>{guestCounts[type]}</span>
                                        <button
                                            onClick={(e) => handleGuestChange(type, 'increase', e)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="done-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowGuestDropdown(false);
                                }}
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default SearchBar;