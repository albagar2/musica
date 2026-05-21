import { Router } from 'express';
import { TrackController } from '../controllers/trackController';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', TrackController.getAll);
router.get('/search', TrackController.search);
router.get('/:id', TrackController.getById);
router.delete('/:id', TrackController.deleteTrack);
router.put('/:id', upload.single('cover'), TrackController.updateTrack);
router.post('/upload', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), TrackController.upload);

export default router;
