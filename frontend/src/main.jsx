import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Book } from './pages/Book.jsx'
import { AddBorrower } from './pages/AddBorrower.jsx'
import { Checkin } from './pages/checkin.jsx'
import { Fines } from './pages/fines.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/book/:id",
    element: <Book />,
  },
  {
    path:"/addborrower",
    element:<AddBorrower/>
  },
  {
    path:"/checkin",
    element:<Checkin/>
  },
  {
    path:"/fines",
    element:<Fines/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
