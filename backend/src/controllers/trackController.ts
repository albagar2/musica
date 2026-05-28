import { Request, Response } from 'express';
import { TrackService } from '../services/trackService';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  }
});
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'musica';
const PUBLIC_R2_URL = process.env.R2_PUBLIC_URL || 'https://pub-your-r2-url.r2.dev';

async function uploadToR2(file: Express.Multer.File, isAudio: boolean): Promise<string> {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
  const filename = (isAudio ? 'audio-' : 'cover-') + uniqueSuffix + ext;
  
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  return `${PUBLIC_R2_URL}/${filename}`;
}

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

    const audioUrl = await uploadToR2(audioFile, true);
    const coverUrl = coverFile ? await uploadToR2(coverFile, false) : undefined;

    const track = await TrackService.create({
      title,
      duration: parseInt(duration),
      artistId,
      url: audioUrl,
      coverUrl,
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
      updateData.coverUrl = await uploadToR2(file, false);
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
