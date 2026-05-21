import { Router } from 'express';
import { PlaylistController } from '../controllers/playlistController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All playlist routes require authentication
router.use(authenticate);

router.get('/', PlaylistController.getAll);
router.post('/', PlaylistController.create);
router.get('/:id', PlaylistController.getById);
router.delete('/:id', PlaylistController.delete);
router.post('/:id/tracks', PlaylistController.addTrack);
router.delete('/:id/tracks/:trackId', PlaylistController.removeTrack);

export default router;
