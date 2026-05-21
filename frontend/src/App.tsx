import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import DashboardHome from './pages/DashboardHome';
import UploadPage from './pages/UploadPage';
import PlaylistDetail from './pages/PlaylistDetail';
import DashboardLayout from './components/DashboardLayout';
import { useAuthStore } from './hooks/useAuth';

function App() {
  const { user } = useAuthStore();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Authenticated Dashboard Routes */}
      <Route path="/dashboard" element={
        user ? <DashboardLayout><DashboardHome /></DashboardLayout> : <Navigate to="/login" />
      } />
      
      <Route path="/library" element={
        user ? <DashboardLayout><Library /></DashboardLayout> : <Navigate to="/login" />
      } />
      
      <Route path="/dashboard/upload" element={
        user ? <DashboardLayout><UploadPage /></DashboardLayout> : <Navigate to="/login" />
      } />
      
      <Route path="/playlist/:id" element={
        user ? <DashboardLayout><PlaylistDetail /></DashboardLayout> : <Navigate to="/login" />
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
