import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Fetch all rooms
// Fetch all rooms (admin might need token too)
export const getRooms = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching rooms:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};

// Book a room
export const bookRoom = async (bookingData, token) => {
  try {
    const data = {
      room_id: bookingData.roomId,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      total_price: bookingData.totalPrice || 100, // Remove user_id, backend gets it from token
    };

    const response = await axios.post(`${API_BASE_URL}/bookings`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Booking error:", error.response?.data || error.message);
    throw error; // Throw error to handle in UI
  }
};

// Fetch all bookings
export const getBookings = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API Response:", response.data); // Debugging step
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching bookings:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Update booking status (approve/reject)
// Update booking status (approve/reject)
export const updateBookingStatus = async (bookingId, status, token) => {
  try {
    await axios.put(
      `${API_BASE_URL}/bookings/${bookingId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error(
      "Error updating booking status:",
      error.response?.data || error.message
    );
    throw error; // Throw to catch in AdminDashboard
  }
};

// Delete a room
export const deleteRoom = async (roomId, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(
      "Error deleting room:",
      error.response?.data || error.message
    );
  }
};

// Process payment (simulated)
export const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    return null;
  }
};

export const getRevenueStats = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/revenue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error.response?.data || error.message);
    return { totalEarnings: 0, totalBookings: 0, monthlyRevenue: [] };
  }
};
