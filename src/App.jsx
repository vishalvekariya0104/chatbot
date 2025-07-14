import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
        
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;