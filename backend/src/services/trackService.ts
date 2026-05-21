import prisma from '../config/database';
import { AppError } from '../shared/errors/AppError';

export class TrackService {
  static async getAll() {
    return prisma.track.findMany({
      include: { artist: true }
    });
  }

  static async getById(id: string) {
    const track = await prisma.track.findUnique({
      where: { id },
      include: { artist: true }
    });
    if (!track) throw AppError.notFound('Canción no encontrada');
    return track;
  }

  static async create(data: any) {
    return prisma.track.create({
      data: {
        title: data.title,
        duration: parseInt(data.duration),
        url: data.url,
        artistId: data.artistId,
        genre: data.genre || 'Clásicos & Chill'
      }
    });
  }

  static async getOrCreateArtist(artistName: string) {
    const name = artistName || 'Artista Desconocido';
    let artist = await prisma.artist.findFirst({ where: { name } });
    
    if (!artist) {
      const user = await prisma.user.create({
        data: {
          email: `artist-${Date.now()}-${Math.random().toString(36).substring(7)}@system.local`,
          password: 'system-generated',
          role: 'ARTIST',
        }
      });
      artist = await prisma.artist.create({
        data: {
          name,
          userId: user.id
        }
      });
    }
    return artist;
  }

  static async search(query: string) {
    return prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { name: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: { artist: true }
    });
  }

  static async updateTrack(id: string, data: any) {
    const track = await this.getById(id);
    
    let artistId = track.artistId;
    if (data.artistName && data.artistName !== track.artist.name) {
      const artist = await this.getOrCreateArtist(data.artistName);
      artistId = artist.id;
    }

    const updateData: any = {
      title: data.title || track.title,
      genre: data.genre || track.genre,
      artistId: artistId
    };

    if (data.coverUrl) {
      updateData.coverUrl = data.coverUrl;
    }

    return prisma.track.update({
      where: { id },
      data: updateData,
      include: { artist: true }
    });
  }

  static async deleteTrack(id: string) {
    const track = await this.getById(id);
    const fs = require('fs');
    const path = require('path');

    // Delete audio file
    if (track.url) {
      const audioPath = path.join(process.cwd(), '../music', path.basename(track.url));
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    // Delete cover image
    if (track.coverUrl && !track.coverUrl.startsWith('http')) {
      const coverPath = path.join(process.cwd(), track.coverUrl);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // Delete from DB
    await prisma.track.delete({ where: { id } });
    return { success: true };
  }
}
