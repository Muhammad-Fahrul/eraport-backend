import express from 'express';
const router = express.Router();

import { login, logout, refresh } from '../controllers/authController.js';

router.post('/', login);
router.get('/refresh', refresh);
router.post('/logout', logout);

export default router;
