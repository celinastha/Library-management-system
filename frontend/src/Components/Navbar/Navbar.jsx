import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("borrowerId");

    navigate("/auth");
  };

  if (location.pathname === '/auth' || location.pathname === '/unauthorized') {
    return null;
  };

  return (
    <nav className="navbar">
        <span className="navbar-title">Library Management System</span>
        <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar;
