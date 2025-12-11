import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const borrowerId = localStorage.getItem("borrowerId");

  if (role === "librarian" && !token) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (role === "borrower" && !borrowerId) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;