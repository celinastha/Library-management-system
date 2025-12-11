import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./fines.css";

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
    <div className="fines-container">
      <div className="fines-card">
        <div className="fines-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <h1 className="page-title">Fines Management</h1>
        <p className="page-subtitle">Search for fines by Card ID</p>

        <form onSubmit={findFines} className="search-form">
          <div className="form-group">
            <label htmlFor="cardId" className="form-label">
              Card ID
            </label>
            <input 
              id="cardId"
              type="text"
              className="form-input"
              placeholder="Enter Card ID"
              value={cardId} 
              onChange={(e)=>setCardId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="search-button">
            Get Fines
          </button>
        </form>

        {error && <div className="message error-message">{error}</div>}
        {message && <div className="message success-message">{message}</div>}

        {fines.length > 0 && (
          <>
            <ul className="fines-list">
              {fines.map((fine,index)=>(
                <li key={index} className="fine-item">
                  <div className="fine-details">
                    <span className="fine-label">Card ID:</span>
                    <span className="fine-value">{fine.Card_id}</span>
                  </div>
                  <div className="fine-details">
                    <span className="fine-label">Total:</span>
                    <span className="fine-value">${Number(fine.Total_Fines).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="fines-actions">
              <button className="action-button" onClick={payFines}>
                Pay Fines
              </button>
              <button className="action-button action-button-refresh" onClick={refreshFines}>
                Refresh
              </button>
            </div>
          </>
        )}

        {fines.length === 0 && cardId && (
          <div className="no-results">
            <p>No fines found for this card ID.</p>
          </div>
        )}
      </div>
    </div>
  )
}