import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Book.css";

export function Book() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.data;
  const { id } = useParams();
  const [status, setStatus] = useState(book?.Status);
  const [borrowerId, setBorrowerId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checkout = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isbn: id,
          card_id: borrowerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setMessage(data.message);
        setStatus("OUT");
        setBorrowerId("");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (!book || !id) {
    return (
      <div className="book-container">
        <div className="book-card">
          <p className="error-message">Book not found</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to Home
          </button>
        </div>
      </div>
    );
    }
    
  return (
    <div className="book-container">
      <div className="book-card">
        <div className="book-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="book-info">
          <h1 className="book-title">{book.Title}</h1>
          <div className="book-details">
            <div className="detail-row">
              <span className="detail-label">ISBN:</span>
              <span className="detail-value">{id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Author(s):</span>
              <span className="detail-value">{book.Authors}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${status === "OUT" ? "status-out" : "status-available"}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        {status !== "OUT" && (
          <div className="checkout-section">
            <h2 className="section-title">Checkout Book</h2>
            <form onSubmit={checkout} className="checkout-form">
              <div className="form-group">
                <label htmlFor="borrower-id" className="form-label">
                  Borrower ID
                </label>
        <input
                  id="borrower-id"
                  type="text"
                  className="form-input"
                  placeholder="Enter borrower ID"
          value={borrowerId}
          onChange={(e) => setBorrowerId(e.target.value)}
                  required
        />
              </div>
              <button type="submit" className="checkout-button">
                Checkout
              </button>
      </form>
          </div>
        )}

        {status === "OUT" && (
          <div className="status-message">
            <p>This book is currently checked out.</p>
          </div>
        )}

        {error && <div className="message error-message">{error}</div>}
        {message && <div className="message success-message">{message}</div>}
      </div>
    </div>
  );
}
