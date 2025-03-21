import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #001f3f;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 5px 0 0;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* Enables horizontal scrolling on small screens */
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  min-width: 600px; /* Ensures table doesn’t shrink too much */

  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    white-space: nowrap; /* Prevents content from breaking */
  }

  th {
    background-color: #f5f5f5;
    color: #001f3f;
  }
`;

const Profile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm();
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
      } catch (err) {
        setProfileError(
          err.response?.data?.message || "Failed to fetch profile"
        );
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchProfile();
    fetchBookings();
  }, [token]);

  const onProfileSubmit = async (data) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.profile_picture?.[0])
      formData.append("profile_picture", data.profile_picture[0]);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile(response.data.user);
      setProfileError("");
      alert("Profile updated successfully!");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/profile/password",
        {
          current_password: data.current_password,
          new_password: data.new_password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordError("");
      alert("Password updated successfully!");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

  return (
    <ProfileContainer>
      <Title>Profile</Title>

      {/* Personal Information */}
      <Section>
        <h3>Personal Information</h3>
        {profile ? (
          <>
            {profile.profile_picture && (
              <ProfilePicture
                src={`http://localhost:5000${profile.profile_picture}`}
                alt="Profile"
              />
            )}
            <Form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Input
                type="text"
                defaultValue={profile.name}
                placeholder="Name"
                {...registerProfile("name", { required: "Name is required" })}
              />
              {profileErrors.name && (
                <ErrorMessage>{profileErrors.name.message}</ErrorMessage>
              )}
              <Input
                type="email"
                defaultValue={profile.email}
                placeholder="Email"
                {...registerProfile("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
              />
              {profileErrors.email && (
                <ErrorMessage>{profileErrors.email.message}</ErrorMessage>
              )}
              <Input
                type="text"
                defaultValue={profile.phone}
                placeholder="Phone number"
                {...registerProfile("phone", {
                  minLength: {
                    value: 7,
                    message: "Phone must be at least 7 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Phone must be less than 20 characters",
                  },
                })}
              />
              {profileErrors.phone && (
                <ErrorMessage>{profileErrors.phone.message}</ErrorMessage>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/png"
                {...registerProfile("profile_picture")}
              />
              {profileError && <ErrorMessage>{profileError}</ErrorMessage>}
              <Button type="submit">Save Changes</Button>
            </Form>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </Section>

      {/* Password Change */}
      <Section>
        <h3>Change Password</h3>
        <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <Input
            type="password"
            placeholder="Current Password"
            {...registerPassword("current_password", {
              required: "Current password is required",
            })}
          />
          {passwordErrors.current_password && (
            <ErrorMessage>
              {passwordErrors.current_password.message}
            </ErrorMessage>
          )}
          <Input
            type="password"
            placeholder="New Password"
            {...registerPassword("new_password", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {passwordErrors.new_password && (
            <ErrorMessage>{passwordErrors.new_password.message}</ErrorMessage>
          )}
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          <Button type="submit">Update Password</Button>
        </Form>
      </Section>

      {/* Booking History */}
      <Section>
        <h3>Booking History</h3>
        <TableWrapper>
          <BookingTable>
            <thead>
              <tr>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.room_number || "N/A"}</td>
                  <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                  <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                  <td>${booking.total_price}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        </TableWrapper>
      </Section>
    </ProfileContainer>
  );
};

export default Profile;
