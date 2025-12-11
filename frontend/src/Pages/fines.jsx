import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function Fines(){
  const [cardId,setCardId]=useState('');
  const [error,setError] = useState('');
  const [message,setMessage]=useState('');
  const [fines,setFines]=useState([]);
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

      if (!response.ok) 
        setError(data.error)
      setFines(data);
    } catch (error) {
      setError(error.message)
    }
  }
  const refreshFines = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/fines/refresh', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) 
        setError(data.error)
      /////////////
      const response2 = await fetch(
        `http://localhost:3000/fines?card_id=${cardId}&paid=${false}`
      );

      const data2 = await response2.json();

      if (!response2.ok) 
        setError(data2.error)
      setFines(data2);
      
    } catch (error) {
      setError(error.message)
    }
  };

  const payFines = async () => {
    try {
      const response = await fetch('http://localhost:3000/fines/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ card_id: cardId }),
      });

      const data = await response.json();

      if (response.status === 409) {
        alert("⚠️ Cannot pay: You must return all overdue books first!");
        return;
      }

      if (!response.ok){
        setError(data.error)
        return;
      }
      const response2 = await fetch(
        `http://localhost:3000/fines?card_id=${cardId}&paid=${false}`
      );

      const data2 = await response2.json();

      if (!response2.ok) 
        setError(data2.error)
      setFines(data2);


    } catch (error) {
      setError(error.message)
    }
  };
  return(
    <div>
      <form onSubmit={findFines}>
        <input placeholder="cardId" value={cardId} onChange={(e)=>setCardId(e.target.value)}/>
        <button>get fines</button>
      </form>
      <li>
        {fines.map((fine,index)=><ul key={index}>
          Card_id: {fine.Card_id}, Total: {Number(fine.Total_Fines).toFixed(2)}
        </ul>)}
      </li>
      {
        (fines.length>0)&&<div>
          <button onClick={payFines}>pay</button>
          <button onClick={refreshFines}>Refresh</button>

        </div>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <button onClick={() => navigate('/')}>Back</button>
      

    </div>
  )
}