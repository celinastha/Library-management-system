import React from 'react'
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />  
      <div className="content">
        <Outlet /> 
      </div>
    </>
  );


}

export default App;

