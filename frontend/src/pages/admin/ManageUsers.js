import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUsers, updateUserRole, deleteUser } from "../../api/api"; // Updated imports

const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #001f3f;
  margin-bottom: 20px;
`;

const TableWrapper = styled.div`
  width: 100%;
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
    background-color: #f8f9fa;
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
  margin-right: 5px;
  margin: 5px;

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

  &.role {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
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

const ManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(token); // Updated to use getUsers
        console.log("Users fetched:", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const updateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole, token); // Updated to use updateUserRole
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId, token); // Updated to use deleteUser
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <Container>
      <Title>Manage Users</Title>

      <div>
        <StyledLink to="/admin">Dashboard</StyledLink>
      </div>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    className="edit"
                    onClick={() => alert("Edit user function pending")}
                  >
                    Edit
                  </Button>
                  <Button
                    className="delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                  {user.role !== "admin" && (
                    <>
                      <Button
                        className="role"
                        onClick={() => updateRole(user.id, "staff")}
                      >
                        Make Staff
                      </Button>
                      <Button
                        className="role"
                        onClick={() => updateRole(user.id, "guest")}
                      >
                        Make Guest
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default ManageUsers;
