import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function Book(){
  const location = useLocation();
  const navigate= useNavigate();
  const book = location.state?.data;
  const { id } = useParams();
  const [status,setStatus]=useState(book.Status);
  const [borrowerId, setBorrowerId]= useState('');
  const [error,setError] = useState('');
  const [message,setMessage]=useState('');
  const checkout= async(event)=>{
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn: id,
          card_id: borrowerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      }else{
        setMessage(data.message)
        setStatus('OUT')
      }


    } catch (error) {
      setError(error.message);

    }
    
  }
  return (
    <div className="homebox-1" style={{ maxWidth: 500, margin: "0em ", padding: "2em" }}>
      {book && id ? (
        <div className="homebox-2" style={{ marginBottom: "2em" }}>
          <h1 style={{ marginBottom: "0.5em" }}>{book.Title}</h1>
          <p><strong>ID:</strong> {id}</p>
          <p><strong>By:</strong> {book.Authors}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      ) : (
        <p>book doesn't exist</p>
      )}
      <form onSubmit={checkout} style={{ marginBottom: "1em" }}>
        <input
          className="search-input-field"
          placeholder="Borrower ID"
          value={borrowerId}
          onChange={(e) => setBorrowerId(e.target.value)}
          style={{ marginRight: "1em" }}
        />
        <button className="search-button">checkout</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <button className="search-button" style={{ marginTop: "1em" }} onClick={() => navigate('/')}>back</button>
    </div>
  )
}