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
import { Fines }  from './Pages/fines.jsx'
import Auth from './Pages/Auth/Auth.jsx'
import ProtectedRoute from './Components/protectedRoutes.jsx'
import Unauthorized from './Pages/Unauthorized.jsx'

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
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/book/:id",
        element: <ProtectedRoute role="librarian"> <Book /> </ProtectedRoute>
      },
      {
        path:"/addborrower",
        element:<ProtectedRoute role="librarian"><AddBorrower/></ProtectedRoute>
      },
      {
        path:"/checkin",
        element:<ProtectedRoute role="librarian"><Checkin/></ProtectedRoute>
      },
      {
        path:"/librarian",
        element: <ProtectedRoute role="librarian"><LibrarianDashboard/></ProtectedRoute>
      },
      {
        path:"/guest",
        element: <GuestDashboard/>
      },
      {
        path:"/fines",
        element: <ProtectedRoute role="librarian"><Fines/></ProtectedRoute>
      }
    ]
  }
   
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
