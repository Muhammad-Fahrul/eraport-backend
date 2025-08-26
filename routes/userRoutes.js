import express from 'express';
const router = express.Router();

import {
  createNewUser,
  getUserByUsername,
  getUsers,
  updateProfilePhoto,
  updateUser,
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import verifyJWT from '../middleware/verifyJWT.js';

router.post('/', createNewUser);

router.use(verifyJWT);
router.route('/').get(getUsers).put(updateUser);
router.get('/:username', getUserByUsername);
router.post('/uploadProfilePhoto', upload.single('file'), updateProfilePhoto);

export default router;
