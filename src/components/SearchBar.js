import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';
import { getLocations, getBookedDates, getAllBookedDates, getBookedDatesByState, getAvailabilityByState, getAvailability } from '../services/api';

const SearchBar = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('All locations');
    const [dates, setDates] = useState('Check-in → Check-out');
    const [guests, setGuests] = useState('2 guests');
    
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);
    
    const [guestCounts, setGuestCounts] = useState({
        adults: 2,
        children: 0,
        infants: 0,
        pets: 0
    });

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [bookedDates, setBookedDates] = useState({ dates: [] });
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

    const locationRef = useRef(null);
    const dateRef = useRef(null);
    const guestRef = useRef(null);

    const [availability, setAvailability] = useState({
        availableDates: [],
        bookedDates: []
    });
    

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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const totalGuests = guestCounts.adults + guestCounts.children;
        setGuests(`${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`);
    }, [guestCounts]);

    useEffect(() => {
        if (selectedDates.checkIn && selectedDates.checkOut) {
            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            };
            setDates(`${formatDate(selectedDates.checkIn)} → ${formatDate(selectedDates.checkOut)}`);
        } else if (selectedDates.checkIn) {
            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            };
            setDates(`${formatDate(selectedDates.checkIn)} → Check-out`);
        } else {
            setDates('Check-in → Check-out');
        }
    }, [selectedDates]);

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

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                let data;
                const today = new Date().toISOString().split('T')[0];
                const sixMonthsLater = new Date();
                sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
                const endDate = sixMonthsLater.toISOString().split('T')[0];
                
                if (selectedLocation === 'CO' || selectedLocation === 'MI') {
                    data = await getAvailabilityByState(selectedLocation, today, endDate);
                    
                    // Debug log to see what the API returns
                    console.log('Availability data:', data);
                    
                    if (!data.availableDates || !data.bookedDates) {
                        throw new Error('Invalid availability data structure');
                    }
                } else if (selectedLocation) {
                    data = await getAvailability(selectedLocation, today, endDate);
                } else {
                    data = { availableDates: [], bookedDates: [] };
                }
                
                setAvailability({
                    availableDates: data.availableDates || [],
                    bookedDates: data.bookedDates || []
                });
            } catch (error) {
                console.error('Error fetching availability:', error);
                setAvailability({
                    availableDates: [],
                    bookedDates: []
                });
            }
        };
        fetchAvailability();
    }, [selectedLocation]);

    const isDateDisabled = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Disable dates before today
        if (date < today) {
            return true;
        }
        
        // If no location selected, allow all future dates
        if (!selectedLocation) return false;
        
        const dateStr = date.toISOString().split('T')[0];
        
        // Disable if date is not in availableDates OR is in bookedDates
        return !availability.availableDates.includes(dateStr) || 
               availability.bookedDates.includes(dateStr);
    };

    const getCapacityDetail = (property, field) => {
        // Check if property has the field directly
        if (property[field] !== undefined) return property[field];
        
        // Check capacityDetails array
        if (Array.isArray(property.capacityDetails)) {
            const capacity = property.capacityDetails[0];
            if (capacity && capacity[field] !== undefined) {
                return capacity[field];
            }
        }
        
        return 'N/A'; // Fallback value
    };

    const handleMonthChange = (increment, e) => {
        e.stopPropagation();
        const newLeftMonth = new Date(leftMonth);
        newLeftMonth.setMonth(newLeftMonth.getMonth() + increment);
        
        const newRightMonth = new Date(newLeftMonth);
        newRightMonth.setMonth(newRightMonth.getMonth() + 1);

        setLeftMonth(newLeftMonth);
        setRightMonth(newRightMonth);
    };

    const handleDateClick = (date, e) => {
    e.stopPropagation();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today || isDateDisabled(date)) return;

    if (!selectedDates.checkIn || selectedDates.checkIn > date || (selectedDates.checkIn && selectedDates.checkOut)) {
        // New selection - check if date is available
        const dateStr = date.toISOString().split('T')[0];
        if (availability.availableDates.includes(dateStr)) {
            setSelectedDates({
                checkIn: date,
                checkOut: null
            });
        }
    } else if (selectedDates.checkIn && !selectedDates.checkOut && date > selectedDates.checkIn) {
        // Check if all dates in range are available
        let tempDate = new Date(selectedDates.checkIn);
        tempDate.setDate(tempDate.getDate() + 1);
        let allDatesAvailable = true;
        
        while (tempDate < date) {
            const tempDateStr = tempDate.toISOString().split('T')[0];
            if (!availability.availableDates.includes(tempDateStr)) {
                allDatesAvailable = false;
                break;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        
        if (allDatesAvailable) {
            setSelectedDates(prev => ({
                ...prev,
                checkOut: date
            }));
        } else {
            // If any date in range is unavailable, reset to just this date
            const dateStr = date.toISOString().split('T')[0];
            if (availability.availableDates.includes(dateStr)) {
                setSelectedDates({
                    checkIn: date,
                    checkOut: null
                });
            }
        }
    }
};

    const handleSearch = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }
    
        const searchParams = new URLSearchParams();
        
        // Handle location parameter
        if (selectedLocation) {
            if (selectedLocation === 'CO' || selectedLocation === 'MI') {
                // For state searches, we need to handle differently in the backend
                searchParams.append('state', selectedLocation);
            } else {
                searchParams.append('location', selectedLocation);
            }
        }
        
        // Format dates correctly
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        searchParams.append('checkIn', formatDate(selectedDates.checkIn));
        searchParams.append('checkOut', formatDate(selectedDates.checkOut));
        searchParams.append('adults', guestCounts.adults);
        searchParams.append('children', guestCounts.children);
        
        navigate(`/search/results?${searchParams.toString()}`);
    };

    const handleGuestChange = (type, operation, e) => {
        e.stopPropagation();
        setGuestCounts(prev => {
            const newValue = operation === 'increase' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            return {
                ...prev,
                [type]: newValue
            };
        });
    };

    const generateCalendarDays = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i));
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        
        const totalCells = Math.ceil(days.length / 7) * 7;
        const nextMonthDays = totalCells - days.length;
        for (let i = 1; i <= nextMonthDays; i++) {
            days.push(new Date(year, month + 1, i));
        }
        
        return days;
    };


    const handleYearChange = (increment, e) => {
        e.stopPropagation();
        const newLeftMonth = new Date(
            leftMonth.getFullYear() + increment,
            leftMonth.getMonth(),
            1
        );
        setLeftMonth(newLeftMonth);
        setRightMonth(new Date(
            newLeftMonth.getFullYear(),
            newLeftMonth.getMonth() + 1,
            1
        ));
    };

    const isDateSelected = (date) => {
        if (!date) return false;
        return (
            (selectedDates.checkIn && date.toDateString() === selectedDates.checkIn.toDateString()) ||
            (selectedDates.checkOut && date.toDateString() === selectedDates.checkOut.toDateString())
        );
    };

    const isDateInRange = (date) => {
        if (!date || !selectedDates.checkIn || !selectedDates.checkOut) return false;
        return date > selectedDates.checkIn && date < selectedDates.checkOut;
    };

    const renderCalendar = () => {
        return (
          <div className="dual-calendar" onClick={e => e.stopPropagation()}>
            <div className="calendar-month">
              <div className="calendar-header">
                <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                <div className="month-year-selector">
                  <span>
                    {leftMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
              </div>
              {renderSingleCalendar(leftMonth)}
            </div>
            
            <div className="calendar-month">
              <div className="calendar-header">
                <button onClick={(e) => handleMonthChange(-1, e)}>&lt;</button>
                <div className="month-year-selector">
                  <span>
                    {rightMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <button onClick={(e) => handleMonthChange(1, e)}>&gt;</button>
              </div>
              {renderSingleCalendar(rightMonth)}
            </div>
          </div>
        );
    };

    const renderSingleCalendar = (monthDate) => {
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();
        const days = generateCalendarDays(month, year);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
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
                        const disabled = isDateDisabled(day);
                        const selected = isDateSelected(day);
                        const inRange = isDateInRange(day);
                        
                        // Highlight available dates differently
                        const dateStr = day.toISOString().split('T')[0];
                        const isAvailable = availability.availableDates.includes(dateStr);
                        
                        return (
                            <div
                                key={day.toISOString()}
                                className={`calendar-day 
                                    ${!isCurrentMonth ? 'other-month' : ''}
                                    ${disabled ? 'disabled' : ''} 
                                    ${selected ? 'selected' : ''} 
                                    ${inRange ? 'in-range' : ''}
                                    ${isAvailable && isCurrentMonth ? 'available' : ''}`}
                                onClick={(e) => !disabled && isCurrentMonth && handleDateClick(day, e)}
                            >
                                {day.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleLocationSelect = (loc) => {
        setSelectedLocation(loc.id);
        setLocation(loc.name);
        setShowLocationDropdown(false);
    };

    return (
        <div className="search-container">
            <div className="search-bar">
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
                            {renderCalendar()}
                        </div>
                    )}
                </div>
                
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
                            <div className="guest-option">
                                <div>
                                    <div className="guest-label">Adults</div>
                                    <div className="guest-subtext">Age 13+</div>
                                </div>
                                <div className="guest-counter">
                                    <button 
                                        onClick={(e) => handleGuestChange('adults', 'decrease', e)}
                                        disabled={guestCounts.adults <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{guestCounts.adults}</span>
                                    <button 
                                        onClick={(e) => handleGuestChange('adults', 'increase', e)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="guest-option">
                                <div>
                                    <div className="guest-label">Children</div>
                                    <div className="guest-subtext">Ages 2 to 12</div>
                                </div>
                                <div className="guest-counter">
                                    <button 
                                        onClick={(e) => handleGuestChange('children', 'decrease', e)}
                                        disabled={guestCounts.children <= 0}
                                    >
                                        -
                                    </button>
                                    <span>{guestCounts.children}</span>
                                    <button 
                                        onClick={(e) => handleGuestChange('children', 'increase', e)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="guest-option">
                                <div>
                                    <div className="guest-label">Infants</div>
                                    <div className="guest-subtext">Under 2</div>
                                </div>
                                <div className="guest-counter">
                                    <button 
                                        onClick={(e) => handleGuestChange('infants', 'decrease', e)}
                                        disabled={guestCounts.infants <= 0}
                                    >
                                        -
                                    </button>
                                    <span>{guestCounts.infants}</span>
                                    <button 
                                        onClick={(e) => handleGuestChange('infants', 'increase', e)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="guest-option">
                                <div>
                                    <div className="guest-label">Pets</div>
                                    <div className="guest-subtext">Not including service animals</div>
                                </div>
                                <div className="guest-counter">
                                    <button 
                                        onClick={(e) => handleGuestChange('pets', 'decrease', e)}
                                        disabled={guestCounts.pets <= 0}
                                    >
                                        -
                                    </button>
                                    <span>{guestCounts.pets}</span>
                                    <button 
                                        onClick={(e) => handleGuestChange('pets', 'increase', e)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
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