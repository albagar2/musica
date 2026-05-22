import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayerStore } from '../hooks/usePlayer';
import './Player.css';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    isShuffle,
    isRepeat,
    togglePlay, 
    toggleShuffle,
    toggleRepeat,
    nextTrack, 
    prevTrack, 
    setVolume 
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset progress when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="player-container animate-fade-in">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        loop={isRepeat}
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="player-info">
        <div className="ambient-glow" />
        {currentTrack.coverUrl ? (
          <img
            src={currentTrack.coverUrl.startsWith('http') || currentTrack.coverUrl.startsWith('blob:') 
              ? currentTrack.coverUrl 
              : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'}${currentTrack.coverUrl}`}
            alt={currentTrack.title}
            className={`player-cover-small${isPlaying ? ' spinning' : ''}`}
          />
        ) : (
          <div className={`player-cover-small placeholder${isPlaying ? ' spinning' : ''}`}>
            <span style={{ fontSize: '10px', opacity: 0.5 }}>🎵</span>
          </div>
        )}

        <div className="player-info-text">
          <h4>{currentTrack.title}</h4>
          <p>{currentTrack.artist?.name || 'Artista desconocido'}</p>
        </div>
        <button
          className={`like-btn${liked ? ' liked' : ''}`}
          onClick={() => setLiked(!liked)}
          title={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="player-controls">
        <div className="control-buttons">
          <button 
            className="icon-btn" 
            onClick={toggleShuffle} 
            title="Aleatorio"
            style={{ color: isShuffle ? 'var(--primary)' : 'inherit' }}
          >
            <Shuffle size={18} />
          </button>
          <button className="icon-btn" onClick={prevTrack} title="Anterior">
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button className="play-btn" onClick={togglePlay} title={isPlaying ? 'Pausa' : 'Reproducir'}>
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button className="icon-btn" onClick={nextTrack} title="Siguiente">
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button 
            className="icon-btn" 
            onClick={toggleRepeat} 
            title="Repetir 1"
            style={{ color: isRepeat ? 'var(--primary)' : 'inherit' }}
          >
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="progress-bar-container">
          <span className="time">{formatTime(currentTime)}</span>
          <div className="progress-bar-bg" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-volume">
        <Volume2 size={20} />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
}
