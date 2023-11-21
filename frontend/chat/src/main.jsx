import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login.tsx'
import Signup from './routes/Signup.tsx'
import Dashboard from './routes/Dashboard.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import Chat from './routes/Chat.jsx'
import Usuarios from './routes/Usuarios.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/Signup',
    element: <Signup />
  },
  {
    // aqui se hara la ruta protegida
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/Dashboard',
        element: <Dashboard />
      },
      {
        path: '/Chat',
        element: <Chat />
      },
      {
        path: '/Usuarios',
        element: <Usuarios />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
