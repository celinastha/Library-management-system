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
    <div>
      {book&&id?<div>
        <h1>{book.Title}</h1>
        <p>ID: {id}</p>
        <p>By: {book.Authors}</p>
        <p>Status: {status}</p>
      </div>:<p>book doesn't exist</p>}
      <form onSubmit={checkout}>
        <input placeholder="Borrower ID" value={borrowerId} onChange={(e)=>setBorrowerId(e.target.value)}/>
        <button>checkout</button>
      </form>
      {error&&<p>{error}</p>}
      {message&&<p>{message}</p>}
      <button onClick={()=>navigate('/')}>back</button>
    </div>
  )
}