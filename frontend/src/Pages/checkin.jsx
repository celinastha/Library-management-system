import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkin.css";

export function Checkin() {
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState([]);
  const [selectedLoanIds, setSelectedLoanIds] = useState([]); 
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const findLoans = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await fetch(`http://localhost:3000/loans/search?q=${search}`);
      const data = await response.json();
      setLoans(data);
      setSelectedLoanIds([]); 
    } catch (err) {
      console.error(err);
      setError("Failed to search loans. Please try again.");
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
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/checkin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanIds: selectedLoanIds }), 
      });

      const result = await response.json();
      
      if (response.ok) {
        const response = await fetch(`http://localhost:3000/loans/search?q=${search}`);
        const data = await response.json();
        setLoans(data);
        setSelectedLoanIds([]); 
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="checkin-container">
      <div className="checkin-card">
        <div className="checkin-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
      </div>

        <h1 className="page-title">Check In Books</h1>
        <p className="page-subtitle">Search for loans by Card ID or Borrower Name</p>

        <form onSubmit={findLoans} className="search-form">
          <div className="form-group">
            <label htmlFor="search" className="form-label">
              Search
            </label>
        <input 
              id="search"
              type="text"
              className="form-input"
              placeholder="Enter Card ID or Borrower Name"
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
              required
        />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
      </form>

        {error && <div className="message error-message">{error}</div>}
        {message && <div className="message success-message">{message}</div>}

        {loans.length > 0 && (
          <div className="loans-section">
            <h2 className="section-title">
              Found Loans ({loans.length})
              {selectedLoanIds.length > 0 && (
                <span className="selected-count">
                  {" "}
                  - {selectedLoanIds.length} selected
                </span>
              )}
            </h2>
            <p className="selection-hint">
              Select up to 3 loans to check in at once
            </p>
            <ul className="loans-list">
        {loans.map((loan) => {
          const isSelected = selectedLoanIds.includes(loan.Loan_id);
          
          return (
            <li 
              key={loan.Loan_id}
                    className={`loan-item ${isSelected ? "loan-item-selected" : ""}`}
              onClick={() => handleSelect(loan.Loan_id)}
            >
              <input 
                type="checkbox" 
                checked={isSelected}
                readOnly
                      className="loan-checkbox"
              />
                    <div className="loan-details">
                      <div className="loan-row">
                        <span className="loan-label">Loan ID:</span>
                        <span className="loan-value">{loan.Loan_id}</span>
                      </div>
                      <div className="loan-row">
                        <span className="loan-label">ISBN:</span>
                        <span className="loan-value">{loan.Isbn}</span>
                      </div>
                      <div className="loan-row">
                        <span className="loan-label">Due Date:</span>
                        <span className="loan-value">
                          {loan.Due_date.substring(0, 10)}
                        </span>
                      </div>
              </div>
            </li>
          );
        })}
      </ul>
          </div>
        )}

      {selectedLoanIds.length > 0 && (
          <div className="checkin-actions">
            <button className="checkin-button" onClick={handleCheckIn}>
          Check In Selected ({selectedLoanIds.length})
        </button>
          </div>
        )}

        {loans.length === 0 && search && (
          <div className="no-results">
            <p>No loans found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
