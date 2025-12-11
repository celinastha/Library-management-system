import React from 'react'
import { useState } from "react";
import "./App.css";
import Search from "./Components/Search/Search";
import AuthPage from "./Pages/Auth/Auth";
import LibrarianDashboard from "./Pages/LibrarianDashboard/LibrarianDashboard";
import BorrowerDashboard from "./Pages/BorrowerDashboard/BorrowerDashboard";
import GuestDashboard from "./Pages/GuestDashboard/GuestDashboard";
import Navbar from "./Components/Navbar/Navbar"

function App() {
  const [role, setRole] = useState(null);
  const [borrowerId, setBorrowerId] = useState("");
  const [token, setToken] = useState(null);

  function logout() {
    setRole(null);
    setToken(null);
    setBorrowerId("");
  }


  if (!role) {
    return (
      <AuthPage
        onSelectRole={setRole}
        setToken={setToken}
        setBorrowerId={setBorrowerId}
      />
    );
  }

  if (role === "librarian") {
    return (
      <>
        <Navbar onLogout={logout}/>
        <LibrarianDashboard token={token}  />
      </>
    );
  }

  if (role === "borrower") {
    return(
      <>
        <Navbar onLogout={logout}/>
        <BorrowerDashboard borrowerId={borrowerId} />
      </>
    );
  }

  if (role === "guest") {
    return(
      <>
        <Navbar onLogout={logout}/>
        <GuestDashboard />
      </>
    );
  }

  return null;


}

export default App;
