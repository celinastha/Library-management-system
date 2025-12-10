import React from 'react'
import Search from '../../Components/Search/Search'

const GuestDashboard = ({ onLogout }) => {
  return (
    <div>
      <h2>Guest Page</h2>
      <button onClick={onLogout}>Logout</button>
      <Search/>
    </div>
  )
}

export default GuestDashboard
