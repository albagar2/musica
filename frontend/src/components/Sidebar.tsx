import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { usePlaylistStore } from '../hooks/usePlaylists';
import { Home, Search, Library as LibraryIcon, LogOut, Upload, Plus, ListMusic } from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { playlists, fetchPlaylists } = usePlaylistStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const navItems = [
    { name: 'Inicio', path: '/dashboard', icon: <Home size={22} /> },
    { name: 'Buscar', path: '/dashboard/search', icon: <Search size={22} /> },
    { name: 'Tu Biblioteca', path: '/library', icon: <LibraryIcon size={22} /> },
    { name: 'Subir Música', path: '/dashboard/upload', icon: <Upload size={22} /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="logo-container">
          <h2>SoundWave</h2>
        </div>
        
        <nav className="nav-menu">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {location.pathname === item.path && (
                    <span className="active-indicator" />
                  )}
                  <span className="icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-divider" />

        <div className="playlists-section">
          <div className="playlists-header">
            <h3>TUS PLAYLISTS</h3>
            <button className="create-playlist-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
            </button>
          </div>
          
          <ul className="playlists-list">
            {playlists.map((pl) => (
              <li key={pl.id}>
                <Link 
                  to={`/playlist/${pl.id}`}
                  className={location.pathname === `/playlist/${pl.id}` ? 'active' : ''}
                >
                  <ListMusic size={18} className="playlist-icon" />
                  <span>{pl.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {showCreateModal && (
        <CreatePlaylistModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
