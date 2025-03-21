import React, { useEffect, useState } from "react";
import { getRevenueStats } from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #001f3f;
  margin-bottom: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: ${({ bg }) => bg || "#007bff"};
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 5px;
`;

const StatValue = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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

const RevenueDashboard = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    monthlyRevenue: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getRevenueStats();
      console.log("Revenue Data:", data); // Debugging output
      // Ensure key names match your API response
      setStats({
        totalEarnings: data.totalEarnings || 0,
        totalBookings: data.totalBookings || 0,
        monthlyRevenue: data.monthlyRevenue || [],
      });
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    }
  };

  return (
    <Container>
      <Title>Revenue & Statistics</Title>

      <div>
        <StyledLink to="/admin">Dashboard</StyledLink>
      </div>

      {/* Overview Section */}
      <Grid>
        <StatCard bg="#28a745">
          <StatTitle>Total Earnings</StatTitle>
          <StatValue>${stats.totalEarnings}</StatValue>
        </StatCard>
        <StatCard bg="#007bff">
          <StatTitle>Total Bookings</StatTitle>
          <StatValue>{stats.totalBookings}</StatValue>
        </StatCard>
      </Grid>

      {/* Monthly Revenue Chart */}
      <h2 style={{ fontSize: "24px", marginTop: "20px", fontWeight: "bold" }}>
        Monthly Revenue
      </h2>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default RevenueDashboard;
