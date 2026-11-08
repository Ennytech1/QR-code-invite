import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

// Event APIs
export const fetchEvents = async (params = {}) => {
  try {
    const res = await api.get('/events', { params });
    return res.data;
  } catch (err) {
    console.warn('[API] fetchEvents fallback to local:', err.message);
    return null;
  }
};

export const fetchEventById = async (id) => {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const createEventApi = async (eventData) => {
  try {
    const res = await api.post('/events', eventData);
    return res.data;
  } catch (err) {
    console.warn('[API] createEventApi failed:', err.message);
    return null;
  }
};

export const fetchEventStats = async (id) => {
  try {
    const res = await api.get(`/events/${id}/stats`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateEventApi = async (id, eventData) => {
  try {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const deleteEventApi = async (id) => {
  try {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

// Guest APIs
export const fetchGuests = async (params = {}) => {
  try {
    const res = await api.get('/guests', { params });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const fetchGuestById = async (id) => {
  try {
    const res = await api.get(`/guests/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const createGuestApi = async (guestData) => {
  try {
    const res = await api.post('/guests', guestData);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const bulkAddGuestsApi = async (eventId, guests) => {
  try {
    const res = await api.post('/guests/bulk', { eventId, guests });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateGuestApi = async (id, guestData) => {
  try {
    const res = await api.put(`/guests/${id}`, guestData);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const deleteGuestApi = async (id) => {
  try {
    const res = await api.delete(`/guests/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

// Ticket APIs
export const fetchTickets = async (params = {}) => {
  try {
    const res = await api.get('/tickets', { params });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const fetchTicketById = async (id) => {
  try {
    const res = await api.get(`/tickets/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const dispatchTicketsApi = async (dispatchData) => {
  try {
    const res = await api.post('/tickets/dispatch', dispatchData);
    return res.data;
  } catch (err) {
    return null;
  }
};

// Scan Verification API (Anti-Replay & Ed25519 check)
export const verifyScanApi = async (
  payload,
  gateName = 'Gate North #1',
  scannerDeviceId = 'scanner_pwa_1',
  admitPlusOnes = undefined,
  admitRemaining = false
) => {
  try {
    const res = await api.post('/scan/verify', {
      qrPayload: payload,
      payload,
      token: typeof payload === 'string' ? payload : (payload?.token || payload?.tid),
      gateName,
      gate: gateName,
      scannerDeviceId,
      scannerId: scannerDeviceId,
      admitPlusOnes,
      admitRemaining,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return null;
  }
};

// Usher Gate Login API
export const usherLoginApi = async (pin, eventId = null) => {
  try {
    const res = await api.post('/scan/usher-login', { pin, eventId });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, message: 'Gate authentication failed' };
  }
};

// Sync Offline Scans API
export const syncScansApi = async (scans) => {
  try {
    const res = await api.post('/scan/sync', { scans });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return null;
  }
};

// Public Pass API
export const fetchPublicPass = async (tokenOrId) => {
  try {
    const res = await api.get(`/tickets/${tokenOrId}/pass`);
    return res.data;
  } catch (err) {
    return null;
  }
};

// Checkout & Payment Initialization API
export const initializeCheckoutApi = async (checkoutData) => {
  try {
    const res = await api.post('/tickets/initialize-checkout', checkoutData);
    return res.data;
  } catch (err) {
    return null;
  }
};

export default api;
