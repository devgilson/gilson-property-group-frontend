import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return api(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            // No refresh token available, logout user
            return Promise.reject(error);
        }

        try {
            const response = await axios.post('/api/auth/refresh', { refreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            processQueue(null, newToken);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
});

export async function searchProperties(queryParams, options = {}) {
    try {
        const response = await api.get(`/properties/search/results?${queryParams}`, options);
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            const errorData = await error.response.json();
            throw new Error(errorData.message);
        }
        throw new Error(error.message || 'Failed to search properties');
    }
}

// api.js
export async function getPropertyDetails(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error('Property not found');
    return await response.json();
}

export async function getPropertyImages(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/images`);
    if (!response.ok) throw new Error('Failed to load property images');
    return await response.json();
}

export async function getPropertyReviews(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/reviews`);
    if (!response.ok) throw new Error('Failed to load reviews');
    return await response.json();
}

export async function getPropertyAmenities(id) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/amenities`);
    if (!response.ok) throw new Error('Failed to load amenities');
    return await response.json();
}

export async function getPropertyQuote(id, checkIn, checkOut, guests) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            checkin_date: checkIn,
            checkout_date: checkOut,
            guests: {
                adults: guests.adults,
                children: guests.children,
                infants: guests.infants,
                pets: guests.pets
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch quote');
    }

    const responseData = await response.json();

    // Ensure the response has the expected structure
    if (!responseData.data?.financials) {
        throw new Error('Invalid quote data structure');
    }

    return responseData.data;
}

export async function getPropertyAvailability(propertyId, startDate, endDate) {
    try {
        const response = await api.get(
            `/properties/property/${propertyId}/availability`,
            { params: { start_date: startDate, end_date: endDate } }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get availability');
    }
}

export async function getLocations() {
    const response = await fetch(`${API_BASE_URL}/properties/locations`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch locations');
    }
    return await response.json();
}

export async function getBookedDates(propertyId) {
    const response = await fetch(`${API_BASE_URL}/properties/property/${propertyId}/booked-dates`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch booked dates');
    }
    const data = await response.json();
    return data;
}

export async function getAllBookedDates(startDate, endDate) {
    const response = await fetch(
        `${API_BASE_URL}/properties/all-booked-dates?start_date=${startDate}&end_date=${endDate}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch all booked dates');
    }
    return await response.json();
}

export async function getBookedDatesByState(stateCode) {
    const response = await fetch(`${API_BASE_URL}/properties/state/${stateCode}/booked-dates`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch booked dates by state');
    }
    const data = await response.json();
    return data;
}

export async function getAvailabilityByState(stateCode, startDate, endDate) {
    const response = await fetch(`${API_BASE_URL}/availability/state/${stateCode}/availability?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch availability by state');
    }
    return await response.json();
}


export async function getAvailability(propertyId, startDate, endDate) {
    const response = await fetch(
        `${API_BASE_URL}/properties/property/${propertyId}/availability?start_date=${startDate}&end_date=${endDate}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch property availability');
    }
    return await response.json();
}

export async function getQuote(propertyId, checkIn, checkOut, guests) {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            checkin_date: checkIn,
            checkout_date: checkOut,
            guests: {
                adults: guests.adults,
                children: guests.children,
                infants: guests.infants,
                pets: guests.pets
            }
        })
    });

    if (response.status === 422) {
        const error = await response.json();
        throw new Error(error.message);
    }

    if (!response.ok) throw new Error('Failed to get quote');
    return response.json();
}

// api.js

// api.js

export async function createBooking(propertyId, bookingData, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Note we're using the numeric ID here - backend will convert to UUID
    const response = await fetch(`${API_BASE_URL}/bookings/create?propertyId=${propertyId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
    }
    return await response.json();
}

export async function getBooking(bookingId) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch booking details');
    }
    return await response.json();
}

export async function cancelBooking(bookingId, token) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to cancel booking');
    }
    return await response.json();
}

export async function blockDates(propertyId, dateStrings, reason = 'RESERVATION', price, minStay) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/calendar/block-dates?propertyId=${propertyId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                dates: dateStrings,
                reason,
                price,
                minStay
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('Content-Length');
        if (contentLength && parseInt(contentLength) > 0) {
            return await response.json();
        }

        return { success: true };

    } catch (err) {
        console.error('Block dates error:', err);
        throw new Error(err.message || 'Failed to block dates');
    }
}

export default api;