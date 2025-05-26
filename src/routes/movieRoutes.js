import express from 'express';
import multer from 'multer';
import {
  uploadMovies,
  listMovies,
  editMovie,
  deleteMovie,
  getAwardsInterval,
} from '../controllers/MovieController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadMovies);
router.get('/', listMovies);
router.put('/:id', editMovie);
router.delete('/:id', deleteMovie);
router.get('/awards', getAwardsInterval);

export default router;
