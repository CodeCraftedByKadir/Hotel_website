import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getRooms, deleteRoom } from "../../api/api"; // Updated imports
import { useAuth } from "../../context/AuthContext"; // Added for token

const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    margin: 20px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #001f3f;
  margin-bottom: 20px;
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

  &.edit {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
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

const LoadingMessage = styled.p`
  font-size: 18px;
  color: #007bff;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
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

const ManageRooms = () => {
  const { token } = useAuth(); // Added to get token
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  });

  const fetchRooms = async () => {
    try {
      const roomsData = await getRooms(token); // Updated to use getRooms with token
      setRooms(roomsData);
    } catch (error) {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoom(roomId, token); // Updated to use deleteRoom
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      alert("Error deleting room.");
    }
  };

  return (
    <Container>
      <Title>Manage Rooms</Title>
      <div>
        <StyledLink to="/admin">Dashboard</StyledLink>
      </div>

      {loading && <LoadingMessage>Loading rooms...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && rooms.length === 0 && (
        <ErrorMessage>No rooms available.</ErrorMessage>
      )}

      {!loading && !error && rooms.length > 0 && (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>${room.price}</td>
                  <td>
                    <Button
                      className="edit"
                      onClick={() => alert("Edit room function pending")}
                    >
                      Edit
                    </Button>
                    <Button
                      className="delete"
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageRooms;
