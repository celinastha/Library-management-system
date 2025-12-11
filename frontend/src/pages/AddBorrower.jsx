import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBorrower.css";

export function AddBorrower() {
  const [borrowerInfo, setBorrowerInfo] = useState({
    ssn: "",
    name: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const createBorrower = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:3000/routes/borrower", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowerInfo),
      });

      const data = await response.json();

      if (!response.ok) setError(data.error);
      else {
        setMessage(data.message);
        setBorrowerInfo({ ssn: "", name: "", address: "", phone: "" });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="add-borrower-container">
      <div className="add-borrower-card">
        <div className="add-borrower-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <h1 className="page-title">Add New Borrower</h1>
        <p className="page-subtitle">Enter the borrower information below</p>

        <form onSubmit={createBorrower} className="borrower-form">
          <div className="form-group">
            <label htmlFor="ssn" className="form-label">
              SSN
            </label>
            <input
              id="ssn"
              type="text"
              className="form-input"
              placeholder="Enter SSN"
              value={borrowerInfo.ssn}
              onChange={(e) =>
                setBorrowerInfo((info) => ({ ...info, ssn: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={borrowerInfo.name}
              onChange={(e) =>
                setBorrowerInfo((info) => ({ ...info, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="form-input"
              placeholder="Enter address"
              value={borrowerInfo.address}
              onChange={(e) =>
                setBorrowerInfo((info) => ({
                  ...info,
                  address: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              placeholder="Enter phone number"
              value={borrowerInfo.phone}
              onChange={(e) =>
                setBorrowerInfo((info) => ({ ...info, phone: e.target.value }))
              }
              required
            />
          </div>

          {error && <div className="message error-message">{error}</div>}
          {message && <div className="message success-message">{message}</div>}

          <button type="submit" className="submit-button">
            Create Borrower
          </button>
        </form>
      </div>
    </div>
  );
}
