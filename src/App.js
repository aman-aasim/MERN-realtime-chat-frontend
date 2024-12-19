import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/AuthComponents/Login';
import ChatRoom from './components/HomeComponents/ChatRoom';
// import './App.css'; // Import your CSS file

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/chatRoom"
            element={isAuthenticated ? <ChatRoom /> : <Navigate to="/" replace />}
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;