import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import JobApplications from './pages/admin/jobApplication.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/job/:jobId/applications",
    element: <JobApplications />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
