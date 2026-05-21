import { useState } from 'react';
import { usePlaylistStore } from '../hooks/usePlaylists';
import { X } from 'lucide-react';
import './PlaylistModals.css';

interface CreatePlaylistModalProps {
  onClose: () => void;
}

export default function CreatePlaylistModal({ onClose }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const { createPlaylist, loading } = usePlaylistStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const success = await createPlaylist(name.trim());
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2>Crear nueva playlist</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Nombre de la playlist..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !name.trim()}>
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
