import { useEffect, useState } from 'react';
import { trackService } from '../services/trackService';
import { usePlayerStore } from '../hooks/usePlayer';
import { Search, Play, Music, Clock, ListPlus, Edit3, Trash2 } from 'lucide-react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import EditTrackModal from '../components/EditTrackModal';
import { useAuthStore } from '../hooks/useAuth';
import './Library.css';

export default function Library() {
  const { token } = useAuthStore();
  const [tracks, setTracks] = useState<any[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [trackToAdd, setTrackToAdd] = useState<string | null>(null);
  const [trackToEdit, setTrackToEdit] = useState<any | null>(null);
  const { playTrack, setQueue, currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    trackService.getAll().then(data => {
      setTracks(data);
      setFilteredTracks(data);
      setQueue(data);
      
      const uniqueGenres = Array.from(new Set(data.map((t: any) => t.genre))).filter(Boolean) as string[];
      const uniqueArtists = Array.from(new Set(data.map((t: any) => t.artist?.name))).filter(Boolean) as string[];
      setGenres(uniqueGenres.sort());
      setArtists(uniqueArtists.sort());
      
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = tracks;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.artist?.name || '').toLowerCase().includes(q)
      );
    }

    if (selectedGenre) {
      result = result.filter(t => t.genre === selectedGenre);
    }

    if (selectedArtist) {
      result = result.filter(t => t.artist?.name === selectedArtist);
    }

    setFilteredTracks(result);
  }, [searchQuery, selectedGenre, selectedArtist, tracks]);

  const handleDelete = async (track: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la canción "${track.title}"?`)) {
      try {
        await trackService.deleteTrack(track.id, token || '');
        setTracks(prev => prev.filter(t => t.id !== track.id));
      } catch (error) {
        console.error('Error deleting track', error);
        alert('Error al eliminar la canción');
      }
    }
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <div className="library-page animate-fade-in">
        <div className="library-header">
          <h2>Tu Biblioteca</h2>
          <div className="library-filters">
            <div className="library-search">
              <Search size={18} className="library-search-icon" />
              <input
                type="text"
                placeholder="Buscar en tu biblioteca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="library-select"
              value={selectedGenre} 
              onChange={e => setSelectedGenre(e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            
            <select 
              className="library-select"
              value={selectedArtist} 
              onChange={e => setSelectedArtist(e.target.value)}
            >
              <option value="">Todos los artistas</option>
              {artists.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="library-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton-cell sk-num"></div>
                <div className="skeleton-cell sk-title"></div>
                <div className="skeleton-cell sk-artist"></div>
                <div className="skeleton-cell sk-genre"></div>
                <div className="skeleton-cell sk-duration"></div>
              </div>
            ))}
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="library-empty">
            <Music size={64} className="empty-icon" />
            <h3>{searchQuery ? 'Sin resultados' : 'Tu biblioteca está vacía'}</h3>
            <p>{searchQuery ? 'Prueba con otro término de búsqueda' : 'Las canciones que escuches aparecerán aquí'}</p>
          </div>
        ) : (
          <div className="track-table">
            <div className="track-table-header">
              <span className="col-num">#</span>
              <span className="col-title">Título</span>
              <span className="col-artist">Artista</span>
              <span className="col-genre">Género</span>
              <span className="col-actions"></span>
              <span className="col-duration"><Clock size={16} /></span>
            </div>
            {filteredTracks.map((track: any, index: number) => (
              <div
                key={track.id}
                className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => playTrack(track)}
              >
                <span className="col-num">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <span className="playing-indicator">
                      <span></span><span></span><span></span>
                    </span>
                  ) : (
                    <>
                      <span className="row-number">{index + 1}</span>
                      <Play size={14} className="row-play" />
                    </>
                  )}
                </span>
                <span className="col-title">
                  <span className="track-title-text">{track.title}</span>
                </span>
                <span className="col-artist">{track.artist?.name || 'Desconocido'}</span>
                <span className="col-genre">{track.genre || 'Sin género'}</span>
                <span className="col-actions">
                  <button 
                    className="add-playlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrackToAdd(track.id);
                    }}
                    title="Añadir a playlist"
                  >
                    <ListPlus size={18} />
                  </button>
                  <button 
                    className="add-playlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrackToEdit(track);
                    }}
                    title="Editar canción"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    className="add-playlist-btn delete"
                    onClick={(e) => handleDelete(track, e)}
                    title="Eliminar canción"
                  >
                    <Trash2 size={18} />
                  </button>
                </span>
                <span className="col-duration">{formatDuration(track.duration)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {trackToAdd && (
        <AddToPlaylistModal 
          trackId={trackToAdd} 
          onClose={() => setTrackToAdd(null)} 
        />
      )}

      {trackToEdit && (
        <EditTrackModal 
          track={trackToEdit} 
          onClose={() => setTrackToEdit(null)} 
          onUpdated={(updatedTrack) => {
            setTracks(prev => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
            setTrackToEdit(null);
          }}
        />
      )}
    </>
  );
}
