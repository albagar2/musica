import prisma from '../config/database';
import { AppError } from '../shared/errors/AppError';

export class PlaylistService {
  static async getUserPlaylists(userId: string) {
    return prisma.playlist.findMany({
      where: { userId },
      include: {
        _count: { select: { tracks: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPlaylistById(id: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({
      where: { id, userId },
      include: {
        tracks: {
          include: {
            track: {
              include: { artist: true }
            }
          }
        }
      }
    });

    if (!playlist) {
      throw AppError.notFound('Playlist no encontrada');
    }
    return playlist;
  }

  static async createPlaylist(name: string, userId: string) {
    if (!name) throw AppError.badRequest('El nombre de la playlist es requerido');
    
    return prisma.playlist.create({
      data: { name, userId }
    });
  }

  static async addTrackToPlaylist(playlistId: string, trackId: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id: playlistId, userId } });
    if (!playlist) throw AppError.notFound('Playlist no encontrada');

    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track) throw AppError.notFound('Canción no encontrada');

    const existing = await prisma.playlistTrack.findUnique({
      where: {
        playlistId_trackId: { playlistId, trackId }
      }
    });

    if (existing) {
      throw AppError.badRequest('La canción ya está en esta playlist');
    }

    return prisma.playlistTrack.create({
      data: { playlistId, trackId }
    });
  }

  static async removeTrackFromPlaylist(playlistId: string, trackId: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id: playlistId, userId } });
    if (!playlist) throw AppError.notFound('Playlist no encontrada');

    await prisma.playlistTrack.delete({
      where: {
        playlistId_trackId: { playlistId, trackId }
      }
    });

    return { success: true };
  }

  static async deletePlaylist(playlistId: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id: playlistId, userId } });
    if (!playlist) throw AppError.notFound('Playlist no encontrada');

    // First delete all PlaylistTrack entries for this playlist
    await prisma.playlistTrack.deleteMany({
      where: { playlistId }
    });

    // Then delete the playlist itself
    await prisma.playlist.delete({
      where: { id: playlistId }
    });

    return { success: true };
  }
}
