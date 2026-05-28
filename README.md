<p align="center">
  <img src="https://img.shields.io/badge/SoundWave-🎵-ff4b4b?style=for-the-badge&labelColor=09090b" alt="SoundWave" />
</p>

<h1 align="center">🎶 SoundWave</h1>

<p align="center">
  <strong>Plataforma de streaming de música gratuita, sin anuncios y sin límites.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.x-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-5.x-2d3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-3-003b57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

---

## 📖 Descripción

**SoundWave** es una aplicación web de streaming de música de estilo Spotify, construida con una arquitectura full-stack moderna. Permite a los usuarios escuchar música de forma gratuita, organizar canciones por categorías, buscar en la biblioteca, subir nuevas canciones y controlar la reproducción con un reproductor integrado completo.

La aplicación viene pre-cargada con **206 canciones** clasificadas automáticamente en 4 géneros musicales, extrayendo metadatos ID3 de los archivos de audio y aplicando algoritmos inteligentes de categorización.

---

## ✨ Características Principales

### 🎧 Reproductor de Música
- Reproductor completo con controles de **Play / Pausa / Siguiente / Anterior**
- Barra de progreso interactiva con clic para saltar
- Control de volumen deslizante
- Modos **Aleatorio (Shuffle)** y **Repetir**
- Botón de **Me gusta** (Like) con animación
- Carátula del álbum con animación de giro durante la reproducción
- Cola de reproducción global gestionada con Zustand

### 🏠 Dashboard
- Vista principal con tarjetas de categorías musicales
- Secciones de canciones agrupadas por género:
  - 🔥 **Reggaeton & Urbano** — Quevedo, Bad Gyal, J Balvin, Farruko, Myke Towers, Nicky Jam, Rvfv...
  - 🎤 **Hip Hop & Rap** — Delaossa, Fernandocosta, Saske, Al2 El Aldeano...
  - ✨ **Pop Latino & Hits** — Aitana, Sebastián Yatra, Calvin Harris, Funzo & Fectro...
  - ☕ **Clásicos & Chill** — Marta Santos, Buena Vista Social Club, Son By Four...
- Scroll horizontal por categoría con tarjetas de gradiente premium
- Sección "Recomendados para ti"

### 🔍 Búsqueda
- Barra de búsqueda en el header con búsqueda por título y artista
- Resultados en tiempo real desde la API

### 📤 Subir Música
- Formulario de subida con campos para:
  - Título de la canción
  - Selección de categoría/género
  - Archivo de audio (MP3, M4A)
  - Carátula (opcional)
- Feedback visual de estado: subiendo, éxito, error

### 🔐 Autenticación
- Sistema de registro e inicio de sesión con JWT
- Tokens de acceso y refresco almacenados en `localStorage`
- Roles de usuario: `USER`, `ARTIST`, `ADMIN`
- Rutas protegidas con redirección automática

### 🎨 Diseño
- Interfaz oscura premium con glassmorfismo
- Gradientes dinámicos generados por hash del título
- Animaciones de entrada (fade-in, slide)
- Scrollbars personalizados
- Tipografía Google Fonts (Outfit)
- Diseño responsive con sidebar fija

---

## 🏗️ Arquitectura del Proyecto

```
musica/
├── music/                    # 📁 206 archivos de audio (MP3/M4A)
│
├── backend/                  # 🖥️ API REST (Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos: User, Artist, Track, Playlist
│   │   ├── seed.ts           # Script de seeding con clasificación inteligente
│   │   ├── dev.db            # Base de datos SQLite
│   │   └── migrations/       # Historial de migraciones
│   ├── src/
│   │   ├── app.ts            # Configuración de Express (CORS, Helmet, etc.)
│   │   ├── server.ts         # Punto de entrada del servidor
│   │   ├── config/           # Configuración de base de datos
│   │   ├── controllers/      # Controladores (Auth, Track)
│   │   ├── middleware/       # Middlewares (Upload, Logger, Auth)
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   └── shared/           # Utilidades y manejo de errores
│   ├── uploads/songs/        # Archivos de audio copiados
│   ├── .env                  # Variables de entorno
│   └── package.json
│
└── frontend/                 # 🎨 SPA (React + TypeScript + Vite)
    ├── index.html            # HTML con SEO y Open Graph
    ├── vite.config.ts        # Proxy a backend en dev
    ├── src/
    │   ├── main.tsx          # Punto de entrada React
    │   ├── App.tsx           # Router principal
    │   ├── components/
    │   │   ├── DashboardLayout.tsx  # Layout con Sidebar + Header + Player
    │   │   ├── Sidebar.tsx          # Navegación lateral
    │   │   └── Player.tsx           # Reproductor de música
    │   ├── pages/
    │   │   ├── Home.tsx             # Landing page pública
    │   │   ├── Login.tsx            # Inicio de sesión
    │   │   ├── Register.tsx         # Registro de usuario
    │   │   ├── DashboardHome.tsx    # Panel principal con categorías
    │   │   ├── Library.tsx          # Biblioteca del usuario
    │   │   └── UploadPage.tsx       # Formulario de subida
    │   ├── hooks/
    │   │   ├── useAuth.ts           # Estado global de autenticación (Zustand)
    │   │   └── usePlayer.ts         # Estado global del reproductor (Zustand)
    │   ├── services/
    │   │   └── trackService.ts      # Cliente HTTP para la API de tracks
    │   └── styles/
    │       └── globals.css          # Variables CSS, utilidades, animaciones
    └── package.json
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React 18, TypeScript, Vite 8, Zustand, Axios, Lucide React, CSS Vanilla |
| **Backend** | Node.js, Express 4, TypeScript, Prisma ORM, music-metadata |
| **Base de Datos** | SQLite (vía Prisma) |
| **Autenticación** | JWT (jsonwebtoken), bcrypt |
| **Seguridad** | Helmet, CORS, express-rate-limit, sanitize-html, Zod |
| **Almacenamiento** | Sistema de archivos local (Multer) |
| **Logging** | Morgan, Winston |

---

## 🚀 Instalación y Uso

### Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd musica
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` (o editar el existente):

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET=tu-clave-secreta-access
JWT_REFRESH_SECRET=tu-clave-secreta-refresh
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### 3. Inicializar la Base de Datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma migrate dev

# Poblar la base de datos con las 206 canciones
npx prisma db seed
```

> **Nota:** El script de seeding lee automáticamente todos los archivos MP3/M4A de la carpeta `music/`, extrae metadatos ID3, limpia los nombres, clasifica el género y copia los archivos a `uploads/songs/`.

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 5. Arrancar la Aplicación

Abrir dos terminales:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
> El servidor se inicia en `http://localhost:4000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
> La aplicación se abre en `http://localhost:5173`

### 6. Acceder a la Aplicación

1. Abre `http://localhost:5173` en tu navegador
2. Regístrate con un email y contraseña, o usa las credenciales del admin:
   - **Email:** `admin@soundwave.com`
   - **Contraseña:** `password123`
3. ¡Disfruta de la música! 🎶

---

## 📱 Progressive Web App (PWA)

SoundWave funciona como una aplicación instalable en móvil y escritorio:
- **Modo Offline**: Al escuchar una canción con conexión, se guarda en la memoria caché local. Si pierdes el internet, podrás seguir reproduciendo tu música descargada y navegando por la app sin interrupciones.
- **Instalable**: Puedes usar "Añadir a la pantalla de inicio" en iOS/Android o instalarla en Chrome/Edge.

---

## ☁️ Despliegue en la Nube (Producción)

Esta aplicación está completamente preparada para producción utilizando servicios serverless y en la nube:

1. **Frontend (Vercel)**
   - La Single Page Application (SPA) se compila con Vite y se despliega en Vercel.
   - Requiere la variable de entorno `VITE_API_URL` apuntando al backend.

2. **Backend (Render)**
   - La API Node.js/Express se despliega como un Web Service en Render.
   - Maneja rutas, autenticación y la conexión con la base de datos y almacenamiento.

3. **Base de Datos (Neon.tech PostgreSQL)**
   - Sustituimos SQLite por **PostgreSQL** alojado en Neon.tech para soportar migraciones seguras y escalabilidad.

4. **Almacenamiento de Canciones (Cloudflare R2)**
   - Los archivos de audio MP3 subidos a través de la aplicación se suben **directamente a Cloudflare R2** en memoria volátil (sin guardarse en el disco de Render).
   - Necesitas configurar: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` y `R2_PUBLIC_URL` en las variables de entorno del servidor.

---

## 📡 API REST

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |

### Tracks

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/tracks` | Obtener todas las canciones |
| `GET` | `/api/tracks/search?q=` | Buscar canciones por título o artista |
| `GET` | `/api/tracks/:id` | Obtener una canción por ID |
| `POST` | `/api/tracks/upload` | Subir nueva canción (multipart/form-data) |

#### Ejemplo de respuesta — `GET /api/tracks`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "QUEVEDO BZRP Music Sessions #52",
      "duration": 198,
      "url": "/uploads/songs/audio-123456.mp3",
      "genre": "Reggaeton & Urbano",
      "artistId": "uuid",
      "artist": {
        "id": "uuid",
        "name": "Quevedo"
      },
      "createdAt": "2026-05-21T16:31:40.000Z"
    }
  ]
}
```

---

## 🗄️ Modelo de Datos

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│   User   │──1:1──│  Artist  │──1:N──│    Track     │
├──────────┤       ├──────────┤       ├──────────────┤
│ id       │       │ id       │       │ id           │
│ email    │       │ name     │       │ title        │
│ password │       │ bio      │       │ duration     │
│ role     │       │ userId   │       │ url          │
│ createdAt│       └──────────┘       │ genre        │
│ updatedAt│                          │ artistId     │
└──────────┘                          │ createdAt    │
     │                                └──────────────┘
     │ 1:N                                   │ N:M
     ▼                                       ▼
┌──────────┐                        ┌───────────────┐
│ Playlist │───────────────N:M──────│ PlaylistTrack │
├──────────┤                        ├───────────────┤
│ id       │                        │ playlistId    │
│ name     │                        │ trackId       │
│ userId   │                        └───────────────┘
│ createdAt│
└──────────┘
```

---

## 📂 Scripts Disponibles

### Backend

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `build` | `npm run build` | Compila TypeScript a JavaScript |
| `start` | `npm start` | Inicia el servidor en modo producción |
| `prisma:generate` | `npm run prisma:generate` | Regenera el cliente de Prisma |
| `prisma:migrate` | `npm run prisma:migrate` | Ejecuta las migraciones pendientes |

### Frontend

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia Vite dev server con HMR |
| `build` | `npm run build` | Genera el bundle de producción |
| `preview` | `npm run preview` | Previsualiza el build de producción |
| `lint` | `npm run lint` | Ejecuta ESLint |

---

## 🎵 Clasificación Automática de Géneros

El sistema de seeding clasifica automáticamente cada canción en una de las 4 categorías basándose en:

1. **Metadatos ID3** del archivo de audio (título, artista) usando la librería `music-metadata`
2. **Nombre del archivo** cuando no hay metadatos disponibles (parseado inteligente de patrones como `"Título   Artista.mp3"`)
3. **Reglas de categorización** basadas en el artista y título:

| Género | Artistas Ejemplo |
|--------|-----------------|
| 🔥 Reggaeton & Urbano | Quevedo, Bad Gyal, J Balvin, Farruko, Nicky Jam, Myke Towers, Rvfv, Manuel Turizo, Lola Indigo, Ozuna |
| 🎤 Hip Hop & Rap | Delaossa, Fernandocosta, Saske, Al2 El Aldeano, Akapellah |
| ✨ Pop Latino & Hits | Aitana, Sebastián Yatra, Calvin Harris, Funzo & Fectro, Marshmello |
| ☕ Clásicos & Chill | Marta Santos, Buena Vista Social Club, Son By Four |

---

## 🔒 Seguridad

- **Helmet** — Cabeceras HTTP seguras
- **CORS** — Control de orígenes permitidos
- **Rate Limiting** — Máximo 100 peticiones por IP cada 15 minutos
- **bcrypt** — Hash de contraseñas con 12 rondas de salt
- **JWT** — Tokens de acceso (15 min) y refresco (7 días)
- **sanitize-html** — Prevención de XSS
- **Zod** — Validación de entrada de datos

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<p align="center">
  Hecho con ❤️ y mucho 🎵
</p>
