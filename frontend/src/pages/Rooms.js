import React, { useEffect, useState } from "react";
import { getRooms } from "../api/api";
import styled from "styled-components";
import { Link } from "react-router-dom";

const RoomsContainer = styled.div`
  padding: 50px;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const RoomCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  h2 {
    font-size: 20px;
    margin: 10px 0;
  }

  p {
    color: #555;
  }

  button {
    background: #ffd700;
    color: #001f3f;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px;

    a {
      text-decoration: none;
      color: inherit;
      font-weight: inherit;
      font-size: inherit;
      display: block;
      width: 100%;
      height: 100%;
    }

    &:hover {
      background: #e6c200;
    }
  }
`;

const Home = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const data = await getRooms();
    setRooms(data);
  };

  return (
    <RoomsContainer>
      <h1 className="text-3xl font-bold mb-5 text-center">Available Rooms</h1>
      <RoomsGrid>
        {rooms.map((room) => (
          <RoomCard key={room.id}>
            <img src={room.image_url} alt={room.name} />
            <h2>{room.name}</h2>
            <p>{room.description}</p>
            <p className="text-lg font-bold">${room.price} per night</p>
            <button>
              <Link to={`/room/${room.id}`}>View Details</Link>
            </button>
          </RoomCard>
        ))}
      </RoomsGrid>
    </RoomsContainer>
  );
};

export default Home;
