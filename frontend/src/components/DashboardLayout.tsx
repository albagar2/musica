import { Search, User as UserIcon, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import Player from './Player';
import { useAuthStore } from '../hooks/useAuth';
import './DashboardLayout.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header glass">
          <div className="header-navigation">
            <button className="nav-btn" onClick={() => window.history.back()} title="Atrás">
              <ChevronLeft size={24} />
            </button>
            <button className="nav-btn" onClick={() => window.history.forward()} title="Adelante">
              <ChevronRight size={24} />
            </button>
          </div>
          
          <form 
            className="header-search" 
            onSubmit={(e) => {
              e.preventDefault();
              const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
              window.location.href = `/dashboard/search?q=${query}`;
            }}
          >
            <Search size={18} className="search-icon" />
            <input name="search" type="text" placeholder="¿Qué quieres escuchar?" />
          </form>

          <div className="header-user">
            <button className="icon-btn-circle"><Bell size={20} /></button>
            <div className="user-profile">
              <div className="avatar">
                {user?.email?.[0].toUpperCase() || <UserIcon size={18} />}
              </div>
              <span>{user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>
      <Player />
    </div>
  );
}
