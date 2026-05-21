import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylistStore } from '../hooks/usePlaylists';
import { usePlayerStore } from '../hooks/usePlayer';
import { Play, Clock, ListMusic, Trash2 } from 'lucide-react';
import './PlaylistDetail.css';

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPlaylist, fetchPlaylistById, removeTrack, deletePlaylist, loading } = usePlaylistStore();
  const { playTrack, setQueue, currentTrack, isPlaying } = usePlayerStore();
  
  useEffect(() => {
    if (id) {
      fetchPlaylistById(id).catch(() => {
        navigate('/library');
      });
    }
  }, [id, fetchPlaylistById, navigate]);

  if (loading && !currentPlaylist) {
    return (
      <div className="playlist-detail animate-fade-in">
        <div className="playlist-header-skeleton shimmer-bg"></div>
      </div>
    );
  }

  if (!currentPlaylist) return null;

  const tracks = currentPlaylist.tracks?.map(pt => pt.track) || [];

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks);
      playTrack(tracks[0]);
    }
  };

  const handleRemoveTrack = async (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (id) {
      await removeTrack(id, trackId);
    }
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta playlist?')) {
      if (id) {
        const success = await deletePlaylist(id);
        if (success) {
          navigate('/library');
        }
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
    <div className="playlist-detail animate-fade-in">
      <div className="playlist-banner">
        <div className="playlist-cover glass">
          <ListMusic size={64} color="var(--primary)" />
        </div>
        <div className="playlist-info">
          <span className="playlist-type">PLAYLIST</span>
          <h1 className="playlist-title">{currentPlaylist.name}</h1>
          <p className="playlist-meta">
            {tracks.length} {tracks.length === 1 ? 'canción' : 'canciones'}
          </p>
        </div>
      </div>

      <div className="playlist-controls">
        <button 
          className="btn-play-large" 
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
        >
          <Play fill="currentColor" size={24} />
        </button>
        <button className="btn-delete-playlist" onClick={handleDeletePlaylist} title="Eliminar Playlist">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="track-table">
        <div className="track-table-header">
          <span className="col-num">#</span>
          <span className="col-title">Título</span>
          <span className="col-artist">Artista</span>
          <span className="col-genre">Género</span>
          <span className="col-actions"></span>
          <span className="col-duration"><Clock size={16} /></span>
        </div>
        
        {tracks.length === 0 ? (
          <div className="playlist-empty">
            <p>Esta playlist está vacía. Añade canciones desde Tu Biblioteca.</p>
          </div>
        ) : (
          tracks.map((track: any, index: number) => (
            <div
              key={track.id}
              className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
              onClick={() => {
                setQueue(tracks);
                playTrack(track);
              }}
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
                  className="remove-track-btn" 
                  onClick={(e) => handleRemoveTrack(e, track.id)}
                  title="Quitar de la playlist"
                >
                  <Trash2 size={16} />
                </button>
              </span>
              <span className="col-duration">{formatDuration(track.duration)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
