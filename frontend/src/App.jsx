import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate=useNavigate();

  const searchBooks = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`http://localhost:3000/search?q=${search}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const getSortedBooks = () => {
    if (!sortColumn) return books;
    const sorted = [...books].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortedBooks = getSortedBooks();

  const sortArrow = (column) => {
    if (sortColumn !== column) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">Library Management System</span>
      </nav>
      <div className="homebox-1">
        <div className="homebox-2">
          <form onSubmit={searchBooks}>
            <input
              className="search-input-field"
              placeholder="search ISBN, Tile, Authors, Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>search</button>
            <text className="text-1">Group Osmium</text>
          </form>
          {error && <p>{error}</p>}

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
