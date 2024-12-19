import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/AuthComponents/Login';
import ChatRoom from './components/HomeComponents/ChatRoom';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/chatRoom"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
  );
}

// A ProtectedRoute to check if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  if (isAuthenticated === null) {
    // Show a loader until authentication is determined
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default App;
