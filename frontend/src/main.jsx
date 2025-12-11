import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Book } from './pages/Book.jsx'
import { AddBorrower } from './pages/AddBorrower.jsx'
import { Checkin } from './pages/checkin.jsx'
import LibrarianDashboard from './Pages/LibrarianDashboard/LibrarianDashboard.jsx'
import BorrowerDashboard from './Pages/BorrowerDashboard/BorrowerDashboard.jsx'
import GuestDashboard from './Pages/GuestDashboard/GuestDashboard.jsx'
import Auth from './Pages/Auth/Auth.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, 
        element:<Navigate to="/auth" replace />
      },
      {
        path: "/auth",
        element: <Auth />,
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
        path:"/librarian",
        element: <LibrarianDashboard/>
      },
      {
        path:"/borrower",
        element: <BorrowerDashboard/>
      },
      {
        path:"/guest",
        element: <GuestDashboard/>
      }
    ]
  }
   
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
