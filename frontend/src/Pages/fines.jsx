import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function Fines(){
  const [cardId,setCardId]=useState('');
  const [error,setError] = useState('');
  const [message,setMessage]=useState('');
  const navigate = useNavigate();
  const findFines= async (event)=>{
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch(
        `http://localhost:3000/fines?card_id=${cardId}&paid=${false}`
      );

      const data = await response.json();
      console.log(data)

      if (!response.ok) 
        setError(data.error)
      return data;
    } catch (error) {
      setError(error.message)
    }
  }
  return(
    <div>
      <form onSubmit={findFines}>
        <input placeholder="cardId" value={cardId} onChange={(e)=>setCardId(e.target.value)}/>
        <button>get fines</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <button onClick={() => navigate('/')}>Back</button>
      

    </div>
  )
}