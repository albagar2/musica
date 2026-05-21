import { useState, useRef } from 'react';
import { trackService } from '../services/trackService';
import { useAuthStore } from '../hooks/useAuth';
import { X, Image as ImageIcon } from 'lucide-react';
import './PlaylistModals.css'; // Reusing modal styles

interface EditTrackModalProps {
  track: any;
  onClose: () => void;
  onUpdated: (updatedTrack: any) => void;
}

export default function EditTrackModal({ track, onClose, onUpdated }: EditTrackModalProps) {
  const { token } = useAuthStore();
  const [title, setTitle] = useState(track.title || '');
  const [artistName, setArtistName] = useState(track.artist?.name || '');
  const [genre, setGenre] = useState(track.genre || '');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(track.coverUrl || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artistName', artistName);
      formData.append('genre', genre);
      if (cover) {
        formData.append('cover', cover);
      }

      const updatedTrack = await trackService.updateTrack(track.id, formData, token);
      onUpdated(updatedTrack);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar la canción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2>Editar Canción</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-scrollable-area">
            <div className="edit-cover-section">
              <div 
                className="cover-preview"
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundImage: coverPreview ? `url(${coverPreview.startsWith('blob:') ? coverPreview : API_BASE + coverPreview})` : 'none' }}
              >
                {!coverPreview && <ImageIcon size={32} color="var(--text-muted)" />}
                <div className="cover-overlay">
                  <span>Cambiar Portada</span>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                style={{ display: 'none' }}
              />
            </div>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Artista</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Género</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
