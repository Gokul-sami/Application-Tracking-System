import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import JobApplications from './pages/admin/jobApplication.jsx';
import Home from './pages/applicant/home.jsx';
import Applications from './pages/applicant/applications.jsx';

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
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/job/:jobId/applications",
    element: <JobApplications />,
  },
  {
    path: "/applicant/home",
    element: <Home />,
  },
  {
    path: "/applicant/my-applications",
    element: <Applications />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
