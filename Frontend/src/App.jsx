import React from 'react'
import { AuthProvider } from './features/auth/context/Auth.context'
import AppRoutes from './routes/Approutes'

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App