import { createApp } from './app';
import { env } from './config/env';
import { SyncService } from './services/syncService';

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 SoundWave Backend running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Iniciar servicio de sincronización de la carpeta music
  SyncService.init();
});
