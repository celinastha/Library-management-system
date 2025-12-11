import React from 'react'
import './Navbar.css'

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
        <span className="navbar-title">Library Management System</span>
        <button onClick={onLogout}>Logout</button>
    </nav>
  )
}

export default Navbar
