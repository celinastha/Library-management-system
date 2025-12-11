import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Checkin() {
  const [search, setSearch] = useState('');
  const [loans, setLoans] = useState([]);
  const [selectedLoanIds, setSelectedLoanIds] = useState([]); 
  const [error,setError] = useState('');
  const [message,setMessage]=useState('');
  const navigate = useNavigate();

  const findLoans = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {

      const response = await fetch(`http://localhost:3000/loans/search?q=${search}`);
      const data = await response.json();
      setLoans(data);
      setSelectedLoanIds([]); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (loanId) => {
    setSelectedLoanIds((prevSelected) => {

      if (prevSelected.includes(loanId)) {
        return prevSelected.filter((id) => id !== loanId);
      }


      if (prevSelected.length >= 3) {
        return prevSelected; 
      }


      return [...prevSelected, loanId];
    });
  };
  const handleCheckIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/checkin', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanIds: selectedLoanIds }), 
      });

      const result = await response.json();
      
      if (response.ok) {
        const response = await fetch(`http://localhost:3000/loans/search?q=${search}`);
        const data = await response.json();
        setLoans(data);
        setSelectedLoanIds([]); 
        setMessage(result.message)
        
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error(err);
      setError(err.message)
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate('/')}>Back</button>
      </div>

      <form onSubmit={findLoans}>
        <input 
          placeholder="Search by Card ID or Name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button type="submit">Search</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {loans.map((loan) => {
          const isSelected = selectedLoanIds.includes(loan.Loan_id);
          
          return (
            <li 
              key={loan.Loan_id}
              onClick={() => handleSelect(loan.Loan_id)}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: isSelected ? "#e6f7ff" : "white", // Visual feedback
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <input 
                type="checkbox" 
                checked={isSelected}
                readOnly
              />
              
              <div>
                <strong>ID:</strong> {loan.Loan_id} | 
                <strong> ISBN:</strong> {loan.Isbn} | 
                <strong> Due:</strong> {loan.Due_date.substring(0, 10)}
              </div>
            </li>
          );
        })}
      </ul>

      {selectedLoanIds.length > 0 && (
        <button 
          style={{ marginTop: "20px", padding: "10px 20px", background: "green", color: "white" }}
          onClick={() => handleCheckIn()}
        >
          Check In Selected ({selectedLoanIds.length})
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}