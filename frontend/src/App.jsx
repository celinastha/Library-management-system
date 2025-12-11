import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./App.css";
import Search from "./Components/Search/Search";
import AuthPage from "./Pages/Auth/Auth";
import LibrarianDashboard from "./Pages/LibrarianDashboard/LibrarianDashboard";
import BorrowerDashboard from "./Pages/BorrowerDashboard/BorrowerDashboard";
import GuestDashboard from "./Pages/GuestDashboard/GuestDashboard";
import Navbar from "./Components/Navbar/Navbar"

function App() {

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate=useNavigate();
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


          <div className="search-result-container">
            {loading ? (
              <p>loading...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleSort("ISBN")}
                    >
                      ISBN{sortArrow("ISBN")}
                    </th>
                    <th
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleSort("Title")}
                    >
                      Title{sortArrow("Title")}
                    </th>
                    <th
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleSort("Authors")}
                    >
                      Authors{sortArrow("Authors")}
                    </th>
                    <th
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleSort("Status")}
                    >
                      Status{sortArrow("Status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBooks.map((book) => (
                    <tr key={book.ISBN}>
                      <Link 
                        to={`/book/${book.ISBN}`} 
                        state={{ data: {Title:book.Title, Authors:book.Authors, Status:book.Status} }}
                      >
                        <td
                          style={{
                            borderRight: "2px solid #ccc",
                            padding: "8px",
                          }}
                        >
                          {book.ISBN}
                        </td>
                        <td
                          style={{
                            borderRight: "2px solid #ccc",
                            padding: "8px",
                          }}
                        >
                          {book.Title}
                        </td>
                        <td
                          style={{
                            borderRight: "2px solid #ccc",
                            padding: "8px",
                          }}
                        >
                          {book.Authors}
                        </td>
                        <td style={{ padding: "8px" }}>{book.Status}</td>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <button onClick={()=>navigate('/addborrower')}>Add borrower</button>
      </div>
    </>
  );
}

export default App;
