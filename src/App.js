import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import { UserAuthContextProvider } from './components/UserAuth';
import Home from './pages/Home';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Blogs from './pages/Blogs';
import Account from './pages/Account';
import Landing from './pages/Landing';
import Reviews from './pages/Reviews';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <UserAuthContextProvider>
      <div className="app-container">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
            <Route path="/travel" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
            <Route path="/blogs" element={<ProtectedRoute> <Blogs /> </ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute> <Account /> </ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute> <Reviews /> </ProtectedRoute>} />
            <Route path="*" element={<Navigate to='/'></Navigate>}></Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </UserAuthContextProvider>
  );
}

export default App;
