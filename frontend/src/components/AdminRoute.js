import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Fetch logged-in user

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return <Navigate to="/" />; // Redirect unauthorized users
  }

  return children;
};

export default AdminRoute;
