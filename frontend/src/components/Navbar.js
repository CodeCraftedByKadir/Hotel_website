import React, { useState } from "react";
import styled from "styled-components";
import { FaHotel, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(0, 15, 45, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  color: #ffd700;
  font-size: 26px;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    margin-right: 8px;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  align-items: center;

  li {
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffd700;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    background: rgba(0, 15, 45, 0.95);
    backdrop-filter: blur(10px);
    display: none;
    text-align: center;
    padding: 20px 0;
    transition: all 0.3s ease-in-out;

    &.active {
      display: flex;
    }

    li {
      padding: 12px 0;
    }
  }
`;

const ProfileIcon = styled(Link)`
  color: #ffffff;
  font-size: 24px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  margin-right: 20px;

  &:hover {
    color: #ffd700;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  div {
    width: 28px;
    height: 3px;
    background: #ffd700;
    margin: 5px 0;
    transition: all 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false); // Close menu function

  return (
    <NavbarContainer>
      <Logo to="/" onClick={closeMenu}>
        <FaHotel size={30} /> Luxury Hotel
      </Logo>
      <NavMenu className={isMenuOpen ? "active" : ""}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/rooms" onClick={closeMenu}>
            Rooms
          </Link>
        </li>
        {user && (
          <li>
            <Link to="/my-bookings" onClick={closeMenu}>
              My Bookings
            </Link>
          </li>
        )}
        {user && (user.role === "admin" || user.role === "staff") && (
          <li>
            <Link to="/admin" onClick={closeMenu}>
              Admin Dashboard
            </Link>
          </li>
        )}
        {!user && (
          <li>
            <Link to="/register" onClick={closeMenu}>
              Register
            </Link>
          </li>
        )}
        {user ? (
          <li
            onClick={() => {
              logout();
              closeMenu();
            }}
            style={{ cursor: "pointer", color: "red" }}
          >
            Logout
          </li>
        ) : (
          <li>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          </li>
        )}
      </NavMenu>

      <RightSection>
        {user && (
          <ProfileIcon
            to="/profile"
            title={`Hello, ${user.name}`}
            onClick={closeMenu}
          >
            <FaUserCircle />
          </ProfileIcon>
        )}
        <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div
            style={{
              transform: isMenuOpen
                ? "rotate(45deg) translate(5px, 5px)"
                : "none",
            }}
          />
          <div style={{ opacity: isMenuOpen ? 0 : 1 }} />
          <div
            style={{
              transform: isMenuOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
        </Hamburger>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;
