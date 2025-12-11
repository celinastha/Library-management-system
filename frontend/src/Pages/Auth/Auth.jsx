import React from 'react'
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../Firebase/firebase";

const Auth = ({ onSelectRole, setBorrowerId, setToken }) => {
    const [mode, setMode] = useState(null);
    const [input, setInput] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLibrarianLogin = async () => {
        try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        const token = await user.user.getIdToken();
        setToken(token);
        onSelectRole("librarian");
        } catch (err) {
        alert("Login failed: " + err.message);
        }
    }

    const handleBorrowerLogin = () => {
        if (!input) return alert("Enter SSN or Card ID");
        setBorrowerId(input);
        onSelectRole("borrower");
    }


  return (
    <div className='Auth'>
        <h1>Welcome to Library System!</h1>
        {!mode && (
            <div>
            <button onClick={() => setMode("librarian")}>I am Librarian</button>
            <button onClick={() => setMode("borrower")}>I am Borrower</button>
            <button onClick={() => onSelectRole("guest")}>I am Guest</button>
            </div>
        )}

        {mode === "librarian" && (
            <form
                onSubmit={(e) => {
                e.preventDefault();
                handleLibrarianLogin();
                }}
            >
                <h2>Librarian Login</h2>
                <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <button type="button" onClick={() => setMode(null)}>Back</button>
            </form>
        )}

        {mode === "borrower" && (
            <form
                onSubmit={(e) => {
                e.preventDefault();
                handleBorrowerLogin();
                }}
            >
                <h2>Borrower Login</h2>
                <input
                placeholder="Enter SSN or Card ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Login</button>
                <button type="button" onClick={() => setMode(null)}>Back</button>
            </form>
        )}

    </div>
  )
}

export default Auth
