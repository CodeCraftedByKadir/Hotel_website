import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getBookings,
  updateBookingStatus,
  getRooms,
  deleteRoom,
} from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 20px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #001f3f;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #001f3f;
  margin-top: 30px;
`;

const TableContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }

  th {
    background-color: #e9ecef;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 7px;

  &.approve {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
    }
  }

  &.reject {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
  padding: 10px 15px;
  background-color: #001f3f;
  color: #ffffff;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #ffd700;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: block;
    margin-right: 0;
  }
`;

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchBookings = React.useCallback(async () => {
    try {
      const data = await getBookings(token);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [token]);

  const fetchRooms = React.useCallback(async () => {
    try {
      const data = await getRooms(token);
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchRooms();
    }
  }, [token, fetchBookings, fetchRooms]);

  const handleApprove = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "approved", token);
      fetchBookings(); // Refresh after update
      alert("Booking approved successfully!");
    } catch (error) {
      alert(
        "Failed to approve booking: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "rejected", token);
      fetchBookings(); // Refresh after update
      alert("Booking rejected successfully!");
    } catch (error) {
      alert(
        "Failed to reject booking: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId, token);
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  return user && (user.role === "admin" || user.role === "staff") ? (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>
      <div>
        <StyledLink to="/admin/manage-users">Manage Users</StyledLink>
        <StyledLink to="/admin/manage-rooms">Manage Rooms</StyledLink>
        <StyledLink to="revenue">Revenue</StyledLink>
      </div>

      <SectionTitle>Room Bookings</SectionTitle>
      <TableContainer>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Guest</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.roomName ?? "Unknown Room"}</td>
                  <td>{booking.userName ?? "Guest"}</td>
                  <td>
                    {booking.checkIn
                      ? new Date(booking.checkIn).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {booking.checkOut
                      ? new Date(booking.checkOut).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.status === "pending" && (
                      <>
                        <Button
                          className="approve"
                          onClick={() => handleApprove(booking.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="reject"
                          onClick={() => handleReject(booking.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>

      <SectionTitle>Manage Rooms</SectionTitle>
      <TableContainer>
        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>${room.price}</td>
                  <td>
                    <Button
                      className="delete"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </DashboardContainer>
  ) : null;
};

export default AdminDashboard;
