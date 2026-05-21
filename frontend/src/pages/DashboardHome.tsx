import { useEffect, useState } from 'react';
import { trackService } from '../services/trackService';
import { usePlayerStore } from '../hooks/usePlayer';
import { Flame, Mic, Sparkles, Coffee } from 'lucide-react';
import './DashboardHome.css';

// Clasificación de géneros dinámicos en base al nombre o artista
const getGenreForTrack = (track: any) => {
  // Si el backend nos proporciona el género/categoría de la base de datos, lo usamos directamente
  if (track.genre) {
    return track.genre;
  }

  const title = (track.title || '').toLowerCase();
  const artist = (track.artist?.name || '').toLowerCase();

  if (
    artist.includes('quevedo') || 
    artist.includes('gyal') || 
    artist.includes('indigo') || 
    artist.includes('mendez') || 
    artist.includes('méndez') || 
    artist.includes('rico') || 
    artist.includes('xriz') || 
    artist.includes('turizo') || 
    artist.includes('crespo') || 
    artist.includes('daddy') || 
    artist.includes('balvin') || 
    artist.includes('bunny') || 
    artist.includes('farruko') || 
    artist.includes('jam') || 
    artist.includes('towers') || 
    artist.includes('rvfv') || 
    artist.includes('miguelo') || 
    artist.includes('ozuna') || 
    artist.includes('bizarrap') || 
    artist.includes('secreto') || 
    artist.includes('pashata') || 
    artist.includes('kamelia') || 
    artist.includes('cano') || 
    artist.includes('tokischa') || 
    artist.includes('miko') || 
    artist.includes('becerra') || 
    artist.includes('tini') || 
    artist.includes('belinda') || 
    artist.includes('proyecto uno') || 
    artist.includes('ovy') || 
    artist.includes('westcol') ||
    title.includes('reggaeton') || 
    title.includes('chulo') || 
    title.includes('fiebre') ||
    title.includes('choque') ||
    title.includes('lala') ||
    title.includes('falda') ||
    title.includes('columbia') ||
    title.includes('vista al mar') ||
    title.includes('tuchat') ||
    title.includes('pepas') ||
    title.includes('bachata') ||
    title.includes('merengue') ||
    title.includes('revolu') ||
    title.includes('revolú') ||
    title.includes('guerrero') ||
    title.includes('travesuras')
  ) {
    return 'Reggaeton & Urbano';
  }
  
  if (
    artist.includes('delaossa') || 
    artist.includes('fernandocosta') || 
    artist.includes('saske') || 
    artist.includes('akapellah') || 
    artist.includes('aldeano') || 
    artist.includes('sceno') || 
    artist.includes('ozmut') ||
    artist.includes('tupac') ||
    artist.includes('2pac') ||
    artist.includes('eminem') ||
    artist.includes('drake') ||
    artist.includes('raggio') ||
    artist.includes('abhir') ||
    artist.includes('eazyboi')
  ) {
    return 'Hip Hop & Rap';
  }
  
  if (
    artist.includes('aitana') || 
    artist.includes('yatra') || 
    artist.includes('calvin harris') || 
    artist.includes('dandee') || 
    artist.includes('funzo') || 
    artist.includes('fectro') || 
    artist.includes('henry') || 
    artist.includes('shakira') || 
    artist.includes('enrique iglesias') || 
    artist.includes('camilo') || 
    artist.includes('morat') || 
    artist.includes('marshmello') ||
    title.includes('mariposas') || 
    title.includes('summer') ||
    title.includes('nena') ||
    title.includes('akí no hay tekno') ||
    title.includes('aki no hay tekno')
  ) {
    return 'Pop Latino & Hits';
  }
  
  return 'Clásicos & Chill';
};

// Generador de gradientes ultra-premium para cubiertas de álbumes
const getGradientForTrack = (title: string) => {
  const gradients = [
    'linear-gradient(135deg, #ff007f 0%, #7f00ff 100%)', // Rosa brillante a Violeta
    'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', // Cian a Azul
    'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)', // Rojo coral a Violeta pastel
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Verde neón a Turquesa
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Rosa salmón a Amarillo
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Indigo a Púrpura oscuro
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)', // Rojo pasión a Naranja suave
    'linear-gradient(135deg, #183b59 0%, #208f88 100%)', // Deep Teal
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

const getGreetingEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 20) return '🌤️';
  return '🌙';
};

const genreIcons = [
  <Flame size={28} />,
  <Mic size={28} />,
  <Sparkles size={28} />,
  <Coffee size={28} />,
];

export default function DashboardHome() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    trackService.getAll().then(data => {
      setTracks(data);
      setQueue(data); // Set global queue
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const genres = [
    { name: 'Reggaeton & Urbano', desc: 'Los ritmos urbanos más calientes', color: '#ba5d07' },
    { name: 'Hip Hop & Rap', desc: 'Letras afiladas y bases pesadas', color: '#1e3264' },
    { name: 'Pop Latino & Hits', desc: 'Melodías pegadizas y éxitos globales', color: '#8d67ab' },
    { name: 'Clásicos & Chill', desc: 'Sonidos legendarios para relajarte', color: '#e8115b' },
  ];

  // Agrupar tracks por categoría
  const getTracksByGenre = (genreName: string) => {
    return tracks.filter(t => getGenreForTrack(t) === genreName);
  };

  return (
    <div className="dashboard-home">
      <h2>{getGreeting()} {getGreetingEmoji()}</h2>
      
      {/* Grid de Categorías Principales */}
      <div className="welcome-grid">
        {genres.map((g, i) => (
          <div 
            key={i} 
            className="welcome-card animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="card-image" style={{ background: getGradientForTrack(g.name) }}>
              <span className="category-icon">
                {genreIcons[i]}
              </span>
            </div>
            <div className="welcome-card-info">
              <h3>{g.name}</h3>
              <p>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Renderizado de Tracks por Categorías / Géneros */}
      {loading ? (
        <>
          {Array.from({ length: 4 }).map((_, sectionIdx) => (
            <div key={sectionIdx} className="skeleton-section">
              <div className="skeleton-header">
                <div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                </div>
                <div className="skeleton-pill"></div>
              </div>
              <div className="skeleton-scroll">
                {Array.from({ length: 5 }).map((_, cardIdx) => (
                  <div key={cardIdx} className="skeleton-card">
                    <div className="skeleton-art"></div>
                    <div className="skeleton-text">
                      <div className="skeleton-text-line"></div>
                      <div className="skeleton-text-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        genres.map((genre) => {
          const genreTracks = getTracksByGenre(genre.name);
          if (genreTracks.length === 0) return null;

          return (
            <section key={genre.name} className="recent-section animate-fade-in">
              <div className="section-header">
                <div>
                  <h3>{genre.name}</h3>
                  <p className="section-subtitle">{genre.desc}</p>
                </div>
                <span className="song-count-pill">{genreTracks.length} canciones</span>
              </div>

              <div className="horizontal-scroll-list">
                {genreTracks.map((track: any) => (
                  <div 
                    key={track.id} 
                    className="album-card"
                    onClick={() => playTrack(track)}
                  >
                    <div 
                      className="album-art-placeholder" 
                      style={{ background: getGradientForTrack(track.title) }}
                    >
                      {track.coverUrl ? (
                        <img src={track.coverUrl} alt={track.title} className="album-cover-img" />
                      ) : (
                        <div className="track-placeholder-overlay">
                          <span className="track-placeholder-symbol">🎵</span>
                        </div>
                      )}
                      <div className="play-hover-overlay">
                        <div className="play-hover-btn">▶</div>
                      </div>
                    </div>
                    <h4>{track.title}</h4>
                    <p>{track.artist?.name || 'Artista desconocido'}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
