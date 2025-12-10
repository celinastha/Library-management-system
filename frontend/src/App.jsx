import { useState } from "react";
import { Link } from 'react-router-dom';
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
        </form>
        {error && <p>{error}</p>}

        {loading ? (
          <p>loading...</p>
        ) : (
          <li className="no-bullet-point">
            {books.map((book) => (
              <ol key={book.ISBN}>
                <Link 
                  to={`/book/${book.ISBN}`} 
                  state={{ data: {Title:book.Title, Authors:book.Authors, Status:book.Status} }}
                >
                  ISBN:{book.ISBN}, Title:{book.Title}, Authors:{book.Authors},
                  Status:{book.Status}
                </Link>
              </ol>
            ))}
          </li>
        )}
      </div>
    </div>
  );
}

export default App;
