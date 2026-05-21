import { Request, Response } from 'express';
import { TrackService } from '../services/trackService';
import { asyncHandler } from '../shared/utils/asyncHandler';

export class TrackController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const tracks = await TrackService.getAll();
    res.json({ success: true, data: tracks });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const track = await TrackService.getById(req.params.id);
    res.json({ success: true, data: track });
  });

  static upload = asyncHandler(async (req: any, res: Response) => {
    const { title, duration, artistId, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const audioFile = files['audio'] ? files['audio'][0] : null;
    const coverFile = files['cover'] ? files['cover'][0] : null;

    if (!audioFile) throw new Error('No se subió el archivo de audio');

    const track = await TrackService.create({
      title,
      duration: parseInt(duration),
      artistId,
      url: `/music/${audioFile.filename}`,
      coverUrl: coverFile ? `/uploads/images/${coverFile.filename}` : undefined,
      genre
    });

    res.status(201).json({ success: true, data: track });
  });

  static search = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const tracks = await TrackService.search(q as string);
    res.json({ success: true, data: tracks });
  });

  static updateTrack = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const { title, artistName, genre } = req.body;
    const file = req.file; // Since we'll use upload.single('cover')

    const updateData: any = {
      title,
      artistName,
      genre
    };

    if (file) {
      updateData.coverUrl = `/uploads/images/${file.filename}`;
    }

    const updatedTrack = await TrackService.updateTrack(id, updateData);
    res.json({ success: true, data: updatedTrack });
  });

  static deleteTrack = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await TrackService.deleteTrack(id);
    res.json({ success: true, message: 'Canción eliminada correctamente' });
  });
}
