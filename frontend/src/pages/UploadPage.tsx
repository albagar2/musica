import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import './UploadPage.css';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Reggaeton & Urbano');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title) return;

    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);
    formData.append('duration', '180');
    formData.append('genre', genre);
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      await axios.post(`${API_BASE}/api/tracks/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setMessage('¡Canción y portada subidas con éxito!');
      setTitle('');
      setGenre('Reggaeton & Urbano');
      setAudioFile(null);
      setCoverFile(null);
    } catch (err) {
      setStatus('error');
      setMessage('Error al subir los archivos. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="upload-page animate-fade-in">
      <div className="upload-header">
        <h1>Publicar Música</h1>
        <p>Sube tu audio y personaliza la carátula</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form glass">
        <div className="form-group">
          <label htmlFor="title">Título de la canción</label>
          <div className="input-wrapper">
            <Music className="input-icon" size={20} />
            <input 
              type="text" 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Midnight City"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="genre">Categoría / Género</label>
          <div className="input-wrapper">
            <Tag className="input-icon" size={20} />
            <select 
              id="genre" 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="genre-select"
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Reggaeton & Urbano" style={{ background: '#121212', color: '#fff' }}>Reggaeton & Urbano</option>
              <option value="Hip Hop & Rap" style={{ background: '#121212', color: '#fff' }}>Hip Hop & Rap</option>
              <option value="Pop Latino & Hits" style={{ background: '#121212', color: '#fff' }}>Pop Latino & Hits</option>
              <option value="Clásicos & Chill" style={{ background: '#121212', color: '#fff' }}>Clásicos & Chill</option>
            </select>
          </div>
        </div>

        <div className="upload-files-row">
          <div className="form-group flex-1">
            <label>Archivo de audio (MP3)</label>
            <div className={`file-dropzone small ${audioFile ? 'has-file' : ''}`}>
              <input type="file" accept="audio/*" onChange={handleAudioChange} required id="audio-input" />
              <label htmlFor="audio-input" className="dropzone-content">
                <Upload size={24} className="upload-icon" />
                {audioFile ? <span className="file-name-small">{audioFile.name}</span> : <span>Elegir MP3</span>}
              </label>
            </div>
          </div>

          <div className="form-group flex-1">
            <label>Carátula (Opcional)</label>
            <div className={`file-dropzone small ${coverFile ? 'has-file' : ''}`}>
              <input type="file" accept="image/*" onChange={handleCoverChange} id="cover-input" />
              <label htmlFor="cover-input" className="dropzone-content">
                <ImageIcon size={24} className="upload-icon" />
                {coverFile ? <span className="file-name-small">{coverFile.name}</span> : <span>Elegir Imagen</span>}
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-premium btn-primary upload-btn"
          disabled={status === 'uploading'}
        >
          {status === 'uploading' ? 'Subiendo archivos...' : 'Publicar ahora'}
        </button>

        {status === 'success' && (
          <div className="status-msg success">
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="status-msg error">
            <AlertCircle size={20} />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
