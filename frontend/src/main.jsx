import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/login.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
