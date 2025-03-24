import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";
console.log(
  "API_BASE_URL SET TO:",
  API_BASE_URL,
  "from env:",
  process.env.REACT_APP_BACKEND_URL
);

// Fetch all rooms
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

// Fetch all bookings (user-specific)
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

// Pay for a booking
export const payBooking = async (bookingId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/pay`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error paying booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (bookingId, reference, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${bookingId}/verify-payment`,
      { reference },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get user profile
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update user profile
export const updateProfile = async (formData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update user password
export const updatePassword = async (passwordData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/profile/password`,
      passwordData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating password:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get single booking
export const getBooking = async (bookingId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get all users (admin)
export const getUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update user role (admin)
export const updateUserRole = async (userId, newRole, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user role:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete user (admin)
export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
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
