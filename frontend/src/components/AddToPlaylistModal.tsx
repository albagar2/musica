import { useEffect, useState } from 'react';
import { usePlaylistStore } from '../hooks/usePlaylists';
import { X, Plus, Check, ListPlus } from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal';
import './PlaylistModals.css';

interface AddToPlaylistModalProps {
  trackId: string;
  onClose: () => void;
}

export default function AddToPlaylistModal({ trackId, onClose }: AddToPlaylistModalProps) {
  const { playlists, fetchPlaylists, addTrack } = usePlaylistStore();
  const [addedTo, setAddedTo] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleAdd = async (playlistId: string) => {
    const success = await addTrack(playlistId, trackId);
    if (success) {
      setAddedTo(prev => ({ ...prev, [playlistId]: true }));
      setTimeout(() => {
        setAddedTo(prev => ({ ...prev, [playlistId]: false }));
      }, 2000);
    }
  };

  if (isCreating) {
    return <CreatePlaylistModal onClose={() => setIsCreating(false)} />;
  }

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2>Añadir a playlist</h2>
        <p className="modal-subtitle">Selecciona una playlist para guardar esta canción</p>
        
        <div className="playlist-list">
          {playlists.length === 0 ? (
            <div className="empty-state">
              <ListPlus size={48} className="empty-icon" />
              <p className="empty-text">No tienes playlists creadas aún.</p>
              <button className="btn-primary" onClick={() => setIsCreating(true)}>
                Crear mi primera playlist
              </button>
            </div>
          ) : (
            playlists.map(playlist => (
              <div key={playlist.id} className="playlist-list-item">
                <div className="playlist-info">
                  <span className="playlist-name">{playlist.name}</span>
                  <span className="playlist-count">{playlist._count?.tracks || 0} canciones</span>
                </div>
                <button 
                  className={`add-btn ${addedTo[playlist.id] ? 'added' : ''}`}
                  onClick={() => handleAdd(playlist.id)}
                  disabled={addedTo[playlist.id]}
                >
                  {addedTo[playlist.id] ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            ))
          )}
        </div>
        
        {playlists.length > 0 && (
          <div className="modal-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button className="btn-secondary" onClick={() => setIsCreating(true)} style={{ width: '100%' }}>
              Crear nueva playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
