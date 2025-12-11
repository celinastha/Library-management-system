import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function AddBorrower(){
  const [borrowerInfo,setBorrowerInfo]=useState({ssn:'',name:'',address:'',phone:''})
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const navigate=useNavigate();
  const createBorrower=async(e)=>{
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await fetch('http://localhost:3000/routes/borrower', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(borrowerInfo),
      });

      const data = await response.json();
      
      if (!response.ok) 
        setError(data.error)
      else
        setMessage(data.message)
  
      
    } catch (error) {
      setError(error.message)

    }


  }
  return(
    <div>
      <form onSubmit={createBorrower}>
        <input placeholder="ssn" value={borrowerInfo.ssn} onChange={(e)=>setBorrowerInfo((info)=>({...info, ssn:e.target.value}))}/>
        <input placeholder="name" value={borrowerInfo.name} onChange={(e)=>setBorrowerInfo((info)=>({...info, name:e.target.value}))}/>
        <input placeholder="address" value={borrowerInfo.address} onChange={(e)=>setBorrowerInfo((info)=>({...info, address:e.target.value}))}/>
        <input placeholder="phone number" value={borrowerInfo.phone} onChange={(e)=>setBorrowerInfo((info)=>({...info, phone:e.target.value}))}/>
        <button>create</button>
      </form>
      {error&&<p>{error}</p>}
      {message&&<p>{message}</p>}
      <button onClick={()=>navigate('/')}>back</button>
    </div>
  )
}