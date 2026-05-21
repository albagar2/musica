import { Request, Response } from 'express';
import { PlaylistService } from '../services/playlistService';
import { asyncHandler } from '../shared/utils/asyncHandler';

export class PlaylistController {
  static getAll = asyncHandler(async (req: any, res: Response) => {
    const playlists = await PlaylistService.getUserPlaylists(req.user.id);
    res.json({ success: true, data: playlists });
  });

  static getById = asyncHandler(async (req: any, res: Response) => {
    const playlist = await PlaylistService.getPlaylistById(req.params.id, req.user.id);
    res.json({ success: true, data: playlist });
  });

  static create = asyncHandler(async (req: any, res: Response) => {
    const playlist = await PlaylistService.createPlaylist(req.body.name, req.user.id);
    res.status(201).json({ success: true, data: playlist });
  });

  static addTrack = asyncHandler(async (req: any, res: Response) => {
    const result = await PlaylistService.addTrackToPlaylist(req.params.id, req.body.trackId, req.user.id);
    res.status(201).json({ success: true, data: result });
  });

  static removeTrack = asyncHandler(async (req: any, res: Response) => {
    await PlaylistService.removeTrackFromPlaylist(req.params.id, req.params.trackId, req.user.id);
    res.json({ success: true, message: 'Canción eliminada de la playlist' });
  });

  static delete = asyncHandler(async (req: any, res: Response) => {
    await PlaylistService.deletePlaylist(req.params.id, req.user.id);
    res.json({ success: true, message: 'Playlist eliminada' });
  });
}
