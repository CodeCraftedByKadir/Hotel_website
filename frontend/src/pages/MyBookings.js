import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookingsContainer = styled.div`
  max-width: 90%;
  margin: 40px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  @media (min-width: 768px) {
    max-width: 800px;
  }
`;

const Title = styled.h2`
  color: #001f3f;
  margin-bottom: 20px;
  text-align: center;
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  min-width: 600px;

  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    color: #001f3f;
  }

  td {
    color: #333;
  }
`;

const Status = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status }) =>
    status === "pending"
      ? "#ffa500"
      : status === "approved"
      ? "#28a745"
      : status === "rejected"
      ? "#dc3545"
      : status === "confirmed"
      ? "#007bff"
      : "#6c757d"};
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: ${({ hide }) => (hide ? "none" : "inline-block")};

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MyBookings = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token, navigate]);

  const handlePayment = async (bookingId) => {
    setProcessingPayment(bookingId);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.payment_url;
    } catch (error) {
      alert(
        "Error initiating payment: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setProcessingPayment(null);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <BookingsContainer>
      <Title>My Bookings</Title>
      {bookings.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <BookingTable>
            <thead>
              <tr>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.roomName}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>${booking.totalPrice}</td>
                  <td>
                    <Status status={booking.status}>{booking.status}</Status>
                  </td>
                  <td>
                    {booking.status === "approved" ? (
                      <Button
                        onClick={() => handlePayment(booking.id)}
                        disabled={processingPayment === booking.id}
                      >
                        {processingPayment === booking.id
                          ? "Processing..."
                          : "Pay Now"}
                      </Button>
                    ) : booking.status === "confirmed" ? (
                      <span style={{ color: "#007bff", fontWeight: "bold" }}>
                        Booked
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No bookings found.</p>
      )}
    </BookingsContainer>
  );
};

export default MyBookings;
