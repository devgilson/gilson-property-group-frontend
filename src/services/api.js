const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

export async function getAllBookedDates() {
    return { dates: [] };
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

