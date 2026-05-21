import { Link } from 'react-router-dom';
import { Headphones, Zap, Shield } from 'lucide-react';
import './Home.css';

const features = [
  {
    icon: Headphones,
    title: 'Audio HD',
    description: 'Calidad de sonido cristalina en cada canción que escuches.',
  },
  {
    icon: Zap,
    title: 'Sin Anuncios',
    description: 'Disfruta de tu música sin interrupciones molestas.',
  },
  {
    icon: Shield,
    title: 'Totalmente Gratis',
    description: 'Acceso completo sin ningún costo. Para siempre.',
  },
];

export default function Home() {
  return (
    <section className="home">
      <div className="home-overlay" />

      <div className="hero">
        <h1 className="logo">SoundWave</h1>
        <p className="subtitle">Escucha música gratis sin anuncios.</p>

        <div className="actions">
          <Link className="btn primary" to="/login">
            Iniciar sesión
          </Link>
          <Link className="btn secondary" to="/register">
            Registrarse
          </Link>
        </div>
      </div>

      <div className="features">
        {features.map((feat, i) => (
          <div
            className="feature-card"
            key={feat.title}
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <feat.icon className="icon" size={36} strokeWidth={1.5} />
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </div>
        ))}
      </div>

      <div className="wave" />
    </section>
  );
}
