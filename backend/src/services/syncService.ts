import chokidar from 'chokidar';
import * as mm from 'music-metadata';
import path from 'path';
import fs from 'fs';
import prisma from '../config/database';

const musicDir = path.join(process.cwd(), '../music');

import { TrackService } from './trackService';

export class SyncService {
  static init() {
    console.log(`[SyncService] Iniciando sincronización de la carpeta: ${musicDir}`);
    
    // Asegurar que la carpeta existe
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir, { recursive: true });
    }

    const watcher = chokidar.watch(musicDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });

    watcher
      .on('add', async (filePath) => {
        if (filePath.endsWith('.mp3') || filePath.endsWith('.wav')) {
          await this.handleFileAdded(filePath);
        }
      })
      .on('unlink', async (filePath) => {
        if (filePath.endsWith('.mp3') || filePath.endsWith('.wav')) {
          await this.handleFileRemoved(filePath);
        }
      });
  }

  private static async handleFileAdded(filePath: string) {
    try {
      const filename = path.basename(filePath);
      const url = `/music/${filename}`;

      // Verificar si ya existe en la base de datos
      const existingTrack = await prisma.track.findFirst({ where: { url } });
      if (existingTrack) return;

      console.log(`[SyncService] Nuevo archivo detectado: ${filename}. Analizando metadatos...`);
      
      const metadata = await mm.parseFile(filePath);
      const title = metadata.common.title || filename.replace(/\.[^/.]+$/, "");
      const artistName = metadata.common.artist || 'Artista Desconocido';
      const duration = metadata.format.duration ? Math.round(metadata.format.duration) : 0;
      const genre = metadata.common.genre && metadata.common.genre.length > 0 ? metadata.common.genre[0] : 'Clásicos & Chill';

      const artist = await TrackService.getOrCreateArtist(artistName);

      await prisma.track.create({
        data: {
          title,
          duration,
          url,
          artistId: artist.id,
          genre
        }
      });

      console.log(`[SyncService] Canción añadida a la base de datos: ${title}`);
    } catch (error) {
      console.error(`[SyncService] Error procesando archivo ${filePath}:`, error);
    }
  }

  private static async handleFileRemoved(filePath: string) {
    try {
      const filename = path.basename(filePath);
      const url = `/music/${filename}`;

      const track = await prisma.track.findFirst({ where: { url } });
      if (track) {
        await prisma.track.delete({ where: { id: track.id } });
        console.log(`[SyncService] Archivo eliminado físicamente. Canción eliminada de la base de datos: ${track.title}`);
      }
    } catch (error) {
      console.error(`[SyncService] Error eliminando archivo ${filePath}:`, error);
    }
  }
}
