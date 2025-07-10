import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocations, getAvailabilityByState, getAvailability, getAllBookedDates } from '../services/api';
import '../styles/SearchBar.css';
import { Spinner } from './Spinner';

const SearchBar = () => {
    const navigate = useNavigate();
    const locationRef = useRef(null);
    const guestRef = useRef(null);

    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);
    const [activeDateField, setActiveDateField] = useState(null); // 'checkIn' or 'checkOut'
    const [loadingDates, setLoadingDates] = useState(false);

    const [location, setLocation] = useState('All locations');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [dates, setDates] = useState('Check-in → Check-out');
    const [guests, setGuests] = useState('2 guests');

    const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
    const [leftMonth, setLeftMonth] = useState(new Date());
    const [rightMonth, setRightMonth] = useState(() => {
        const next = new Date();
        next.setMonth(next.getMonth() + 1);
        return next;
    });

    const [guestCounts, setGuestCounts] = useState({
        adults: 2,
        children: 0,
        infants: 0,
        pets: 0
    });

    const [locations, setLocations] = useState([]);
    const [availability, setAvailability] = useState({
        availableDates: [],
        bookedDates: []
    });

    const availabilityCache = useRef({});

    const availabilityMaps = useMemo(() => ({
        available: new Set(availability.availableDates),
        booked: new Set(availability.bookedDates)
    }), [availability]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    useEffect(() => {
        const todayStr = today.toISOString().split('T')[0];
        const end = new Date(today);
        end.setMonth(end.getMonth() + 6);
        const endStr = end.toISOString().split('T')[0];

        Promise.all([
            getLocations(),
            getAllBookedDates(todayStr, endStr)
        ])
            .then(([locs, avail]) => {
                setLocations(locs);
                setAvailability({ availableDates: [], bookedDates: avail.bookedDates || [] });
            })
            .catch(() => setAvailability({ availableDates: [], bookedDates: [] }));
    }, [today]);

    useEffect(() => {
        const cached = localStorage.getItem('cachedLocations');
        if (cached) setLocations(JSON.parse(cached));
        else {
            getLocations().then((data) => {
                setLocations(data);
                localStorage.setItem('cachedLocations', JSON.stringify(data));
            });
        }
    }, []);

    useEffect(() => {
        const total = guestCounts.adults + guestCounts.children;
        setGuests(`${total} guest${total !== 1 ? 's' : ''}`);
    }, [guestCounts]);

    useEffect(() => {
        if (selectedDates.checkIn && selectedDates.checkOut) {
            const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            setDates(`${fmt(selectedDates.checkIn)} → ${fmt(selectedDates.checkOut)}`);
        } else if (selectedDates.checkIn) {
            const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            setDates(`${fmt(selectedDates.checkIn)} → Check-out`);
        } else {
            setDates('Check-in → Check-out');
        }
    }, [selectedDates]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target)) {
                setShowLocationDropdown(false);
            }
            if (guestRef.current && !guestRef.current.contains(e.target)) {
                setShowGuestDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoadingDates(true);

        const todayStr = today.toISOString().split('T')[0];
        const end = new Date(today);
        end.setMonth(end.getMonth() + 6);
        const endStr = end.toISOString().split('T')[0];

        const fetchAvailability = async () => {
            try {
                const cacheKey = `${selectedLocation || 'all'}_${todayStr}_${endStr}`;
                if (availabilityCache.current[cacheKey]) {
                    setAvailability(availabilityCache.current[cacheKey]);
                    return;
                }
                let data;
                if (selectedLocation === 'CO' || selectedLocation === 'MI') {
                    data = await getAvailabilityByState(selectedLocation, todayStr, endStr);
                } else if (selectedLocation) {
                    data = await getAvailability(selectedLocation, todayStr, endStr);
                } else {
                    const all = await getAllBookedDates(todayStr, endStr);
                    data = { availableDates: [], bookedDates: all.bookedDates || [] };
                }

                const normalized = {
                    availableDates: data.availableDates || [],
                    bookedDates: data.bookedDates || []
                };
                availabilityCache.current[cacheKey] = normalized;
                setAvailability(normalized);
            } catch {
                setAvailability({ availableDates: [], bookedDates: [] });
            } finally {
                setLoadingDates(false);
            }
        };

        fetchAvailability();
        return () => controller.abort();
    }, [selectedLocation, today]);

    const generateCalendarDays = useCallback((month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        const firstDayOfWeek = firstDay.getDay();
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i));
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        const total = Math.ceil(days.length / 7) * 7;
        for (let i = 1; days.length < total; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    }, []);

    const isDateAvailable = useCallback((d) => {
        const str = d.toISOString().split('T')[0];
        if (selectedLocation) {
            return availabilityMaps.available.has(str) && !availabilityMaps.booked.has(str);
        }
        return !availabilityMaps.booked.has(str);
    }, [availabilityMaps, selectedLocation]);

    const handleDateClick = useCallback((date, e) => {
        e.stopPropagation();
        if (date < today || !isDateAvailable(date)) return;

        setSelectedDates((prev) => {
            if (prev.checkIn?.toDateString() === date.toDateString() && !prev.checkOut) {
                return { checkIn: null, checkOut: null };
            }
            if (!prev.checkIn || date < prev.checkIn) {
                return { checkIn: date, checkOut: null };
            }

            if (prev.checkIn && !prev.checkOut) {
                let temp = new Date(prev.checkIn);
                temp.setDate(temp.getDate() + 1);
                let valid = true;
                while (temp < date) {
                    const str = temp.toISOString().split('T')[0];
                    if (!isDateAvailable(temp)) {
                        valid = false;
                        break;
                    }
                    temp.setDate(temp.getDate() + 1);
                }
                return valid ? { ...prev, checkOut: date } : { checkIn: date, checkOut: null };
            }

            return { ...prev, checkOut: date };
        });
    }, [availabilityMaps, selectedLocation, today]);

    const renderSingleCalendar = (monthDate, days) => {
        const month = monthDate.getMonth();

        const isSelected = (date) =>
            selectedDates.checkIn?.toDateString() === date.toDateString() ||
            selectedDates.checkOut?.toDateString() === date.toDateString();

        const isInRange = (date) =>
            selectedDates.checkIn && selectedDates.checkOut &&
            date > selectedDates.checkIn && date < selectedDates.checkOut;

        return (
            <div className="calendar">
                <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="weekday">{d}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {days.map((day, i) => {
                        const disabled = day < today || (day.getMonth() !== month);
                        const available = isDateAvailable(day);
                        const inRange = isInRange(day);

                        return (
                            <div
                                key={i}
                                className={`calendar-day ${disabled ? 'disabled' : ''} ${isSelected(day) ? 'selected' : ''} ${inRange ? 'in-range' : ''}`}
                                onClick={(e) => !disabled && available && handleDateClick(day, e)}
                            >
                                {day.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const leftDays = useMemo(() => generateCalendarDays(leftMonth.getMonth(), leftMonth.getFullYear()), [generateCalendarDays, leftMonth]);
    const rightDays = useMemo(() => generateCalendarDays(rightMonth.getMonth(), rightMonth.getFullYear()), [generateCalendarDays, rightMonth]);

    const handleMonthChange = (inc, e) => {
        e.stopPropagation();
        const newLeft = new Date(leftMonth);
        newLeft.setMonth(newLeft.getMonth() + inc);
        const newRight = new Date(newLeft);
        newRight.setMonth(newRight.getMonth() + 1);
        setLeftMonth(newLeft);
        setRightMonth(newRight);
    };

    const handleGuestChange = (type, op, e) => {
        e.stopPropagation();
        setGuestCounts((prev) => ({
            ...prev,
            [type]: Math.max(0, op === 'increase' ? prev[type] + 1 : prev[type] - 1)
        }));
    };

    const handleSearch = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }

        const params = new URLSearchParams();
        if (selectedLocation) {
            if (['CO', 'MI'].includes(selectedLocation)) {
                params.append('state', selectedLocation);
            } else {
                params.append('propertyId', selectedLocation);
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
            <div className="search-grid">
                {/* Location */}
                <div className="search-field" ref={locationRef} onClick={() => {
                    setShowLocationDropdown(!showLocationDropdown);
                    setShowGuestDropdown(false);
                    setShowDateDropdown(false);
                }}>
                    <label className="search-label">Location</label>
                    <div className="search-value-row">
                        <div className="search-value">{location}</div>
                        <div className="dropdown-arrow">⌄</div>
                    </div>
                    {showLocationDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-title">Select Location</div>
                            <div className="dropdown-item" onClick={() => {
                                setSelectedLocation('');
                                setLocation('All locations');
                                setShowLocationDropdown(false);
                            }}>All locations</div>
                            {locations.map((loc) => (
                                <div key={loc.id} className={`dropdown-item ${selectedLocation === loc.id ? 'selected' : ''}`} onClick={() => {
                                    setSelectedLocation(loc.id);
                                    setLocation(loc.name);
                                    setShowLocationDropdown(false);
                                }}>{loc.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Check-in */}
                <div className="search-field" style={{ position: 'relative' }} onClick={() => {
                    setShowDateDropdown(true);
                    setActiveDateField('checkIn');
                    setShowLocationDropdown(false);
                    setShowGuestDropdown(false);
                }}>
                    <label className="search-label">Check-in</label>
                    <div className="search-value-row">
                        <div className="search-value">{selectedDates.checkIn ? selectedDates.checkIn.toLocaleDateString() : 'Add dates'}</div>
                        <div className="dropdown-arrow">⌄</div>
                    </div>
                    {showDateDropdown && activeDateField === 'checkIn' && (
                        <div className="date-dropdown-menu">
                            {loadingDates && (
                                <div className="calendar-loading-overlay">
                                    <Spinner size="small" />
                                </div>
                            )}
                            <div className="dual-calendar">
                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>{leftMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(leftMonth, leftDays)}
                                </div>
                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>{rightMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(rightMonth, rightDays)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Check-out */}
                <div className="search-field" style={{ position: 'relative' }} onClick={() => {
                    setShowDateDropdown(true);
                    setActiveDateField('checkOut');
                    setShowLocationDropdown(false);
                    setShowGuestDropdown(false);
                }}>
                    <label className="search-label">Check-out</label>
                    <div className="search-value-row">
                        <div className="search-value">{selectedDates.checkOut ? selectedDates.checkOut.toLocaleDateString() : 'Add dates'}</div>
                        <div className="dropdown-arrow">⌄</div>
                    </div>
                    {showDateDropdown && activeDateField === 'checkOut' && (
                        <div className="date-dropdown-menu">
                            {loadingDates && <Spinner size="small" />}
                            <div className="dual-calendar">
                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>{leftMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(leftMonth, leftDays)}
                                </div>
                                <div className="calendar-month">
                                    <div className="calendar-header">
                                        <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                                        <span>{rightMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                        <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
                                    </div>
                                    {renderSingleCalendar(rightMonth, rightDays)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guests */}
                <div className="search-field" ref={guestRef} onClick={() => {
                    setShowGuestDropdown(!showGuestDropdown);
                    setShowDateDropdown(false);
                    setShowLocationDropdown(false);
                }}>
                    <label className="search-label">Guests</label>
                    <div className="search-value-row">
                        <div className="search-value">{guests}</div>
                        <div className="dropdown-arrow">⌄</div>
                    </div>
                    {showGuestDropdown && (
                        <div className="guest-dropdown-menu">
                            {['adults', 'children', 'infants', 'pets'].map((type) => (
                                <div key={type} className="guest-option">
                                    <div>
                                        <div className="guest-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                                        <div className="guest-subtext">
                                            {type === 'adults' ? 'Age 13+' :
                                                type === 'children' ? 'Ages 2–12' :
                                                    type === 'infants' ? 'Under 2' : 'Not including service animals'}
                                        </div>
                                    </div>
                                    <div className="guest-counter">
                                        <button onClick={(e) => handleGuestChange(type, 'decrease', e)} disabled={guestCounts[type] <= (type === 'adults' ? 1 : 0)}>-</button>
                                        <span>{guestCounts[type]}</span>
                                        <button onClick={(e) => handleGuestChange(type, 'increase', e)}>+</button>
                                    </div>
                                </div>
                            ))}
                            <button className="done-button" onClick={(e) => {
                                e.stopPropagation();
                                setShowGuestDropdown(false);
                            }}>Done</button>
                        </div>
                    )}
                </div>

                {/* Search */}
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default SearchBar;
