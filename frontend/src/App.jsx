import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchBooks = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const response = await fetch(`http://localhost:3000/search?q=${search}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setBooks(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch books. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <th style={{ padding: "8px" }}>
                    ISBN
                  </th>
                  <th style={{ padding: "8px" }}>
                    Title
                  </th>
                  <th style={{ padding: "8px" }}>
                    Authors
                  </th>
                  <th style={{ padding: "8px" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.ISBN}>
                    <td style={{ borderRight: "2px solid #ccc", padding: "8px" }}>
                      {book.ISBN}
                    </td>
                    <td style={{ borderRight: "2px solid #ccc", padding: "8px" }}>
                      {book.Title}
                    </td>
                    <td style={{ borderRight: "2px solid #ccc", padding: "8px" }}>
                      {book.Authors}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {book.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
