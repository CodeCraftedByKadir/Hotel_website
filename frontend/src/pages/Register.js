import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { registerUser } from "../api/api";

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #001f3f;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 16px;

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

const TextLink = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #555;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    if (result) {
      alert("Registration successful!");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <RegisterContainer>
      <Title>Register</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <Button type="submit">Register</Button>
      </form>
      <TextLink>
        Already have an account? <Link to="/login">Login here</Link>
      </TextLink>
    </RegisterContainer>
  );
};

export default Register;
