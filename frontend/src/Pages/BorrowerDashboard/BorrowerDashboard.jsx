import React from 'react'

const BorrowerDashboard = ({ onLogout }) => {
  return (
    <div>
      <h2>Borrower Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}

export default BorrowerDashboard
