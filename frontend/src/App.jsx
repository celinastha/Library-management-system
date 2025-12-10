import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks]=useState([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(false);
  const [error, setError]=useState('');
  const searchBooks= async(event)=>{
    event.preventDefault()
    try {
      setError('');
      const response = await fetch(`http://localhost:3000/search?q=${search}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      setBooks(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch books. Is the backend running?");
    } finally {
      setLoading(false);
    }

  }


  return (
    <div>
      <form onSubmit={searchBooks}>
        <input placeholder='search ISBN, Tile, Authors, Status...' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <button>search</button>
      </form>
      {error&&<p>{error}</p>}

      {loading?<p>loading...</p>:<li>
        {books.map((book)=>(<ol key={book.ISBN}>
          ISBN:{book.ISBN}, Title:{book.Title}, Authors:{book.Authors}, Status:{book.Status}
        </ol>))}
      </li>}

    </div>
  )
}

export default App
