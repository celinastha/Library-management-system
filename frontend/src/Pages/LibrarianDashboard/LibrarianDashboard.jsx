import React from 'react'
import Search from '../../Components/Search/Search'

const LibrarianDashboard = ({ onLogout }) => {
  return (
    <div>
      <h2>Librarian Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      <Search/>
    </div>
  )
}

export default LibrarianDashboard
