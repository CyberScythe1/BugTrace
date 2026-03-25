import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewReview from './pages/NewReview';
import ReviewResult from './pages/ReviewResult';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('bt_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/new-review" element={user ? <NewReview /> : <Navigate to="/" />} />
            <Route path="/review/:id" element={user ? <ReviewResult /> : <Navigate to="/" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
