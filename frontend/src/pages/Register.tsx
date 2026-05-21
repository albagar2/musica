import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { Mail, User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import './Register.css';

function getPasswordStrength(pw: string): { width: string; color: string } {
  if (pw.length === 0) return { width: '0%', color: 'transparent' };
  if (pw.length < 4) return { width: '25%', color: '#ef4444' };
  if (pw.length < 8) return { width: '55%', color: '#f59e0b' };
  return { width: '100%', color: '#22c55e' };
}

export default function Register() {
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">SoundWave</h1>
        <p className="subtitle">Crea tu cuenta gratuita</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="form-field">
            <Mail className="field-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* Username */}
          <div className="form-field">
            <User className="field-icon" size={18} />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          {/* Display name (optional visible label) */}
          <div className="form-field">
            <User className="field-icon" size={18} />
            <input
              type="text"
              name="displayName"
              placeholder="Nombre para mostrar"
              value={form.displayName}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          {/* Password */}
          <div className="form-field">
            <Lock className="field-icon" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div className="password-strength">
              <div
                className="password-strength-fill"
                style={{ width: strength.width, backgroundColor: strength.color }}
              />
            </div>
          )}

          {/* Confirm password */}
          <div className="form-field">
            <Lock className="field-icon" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Repetir contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Creando cuenta…
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
