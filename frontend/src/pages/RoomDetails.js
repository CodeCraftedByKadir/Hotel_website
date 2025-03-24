import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getRooms, bookRoom, getBooking, payBooking } from "../api/api"; // Updated imports
import { useAuth } from "../context/AuthContext";

const RoomDetailsContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const RoomImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
`;

const RoomTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #001f3f;
  margin-top: 20px;
`;

const RoomDescription = styled.p`
  color: #555;
  margin: 10px 0;
`;

const RoomPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #28a745;
  margin: 10px 0;
`;

const BookingSection = styled.div`
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #001f3f;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;

  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const StatusText = styled.p`
  color: #555;
  margin-top: 10px;
`;

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [room, setRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    fetchRoomDetails();
    if (bookingId) fetchBookingStatus();
  }, [bookingId]); // Added bookingId dependency

  const fetchRoomDetails = async () => {
    const rooms = await getRooms(token); // Pass token if required by backend
    const selectedRoom = rooms.find((r) => r.id === parseInt(id));
    setRoom(selectedRoom);
  };

  const fetchBookingStatus = async () => {
    try {
      const booking = await getBooking(bookingId, token); // Updated to use getBooking
      setBookingStatus(booking.status);
    } catch (error) {
      console.error("Error fetching booking status:", error);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    try {
      const bookingResponse = await bookRoom(
        {
          roomId: room.id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          userId: user.id,
        },
        token
      );

      if (bookingResponse) {
        setBookingId(bookingResponse.id);
        alert(
          `Hey ${user.name}, your booking is pending approval. Check your bookings for updates!`
        );
        navigate("/my-bookings"); // Redirect here
      }
    } catch (error) {
      alert(
        "Booking failed: " +
          (error.response?.data?.message ||
            "Please check your login status or try again.")
      );
    }
  };

  const handlePayment = async () => {
    if (!bookingId) {
      alert("Please book a room first.");
      return;
    }

    try {
      const response = await payBooking(bookingId, token); // Updated to use payBooking
      const { payment_url } = response;
      window.location.href = payment_url;
    } catch (error) {
      alert(
        "Error initiating payment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (!room) return <p>Loading...</p>;

  return (
    <RoomDetailsContainer>
      <RoomImage src={room.image_url} alt={room.name} />
      <RoomTitle>{room.name}</RoomTitle>
      <RoomDescription>{room.description}</RoomDescription>
      <RoomPrice>${room.price} per night</RoomPrice>

      <BookingSection>
        <Label>Check-in Date:</Label>
        <Input
          type="date"
          onChange={(e) =>
            setBookingData({ ...bookingData, checkIn: e.target.value })
          }
        />
        <Label>Check-out Date:</Label>
        <Input
          type="date"
          onChange={(e) =>
            setBookingData({ ...bookingData, checkOut: e.target.value })
          }
        />
        <Label>Guests:</Label>
        <Input
          type="number"
          min="1"
          value={bookingData.guests}
          onChange={(e) =>
            setBookingData({ ...bookingData, guests: e.target.value })
          }
        />
        <Button onClick={handleBooking}>Book Now</Button>
        {bookingId && (
          <>
            <StatusText>
              Booking Status: {bookingStatus || "Loading..."}
            </StatusText>
            {bookingStatus === "approved" && (
              <Button onClick={handlePayment}>Proceed to Payment</Button>
            )}
          </>
        )}
      </BookingSection>
    </RoomDetailsContainer>
  );
};

export default RoomDetails;
