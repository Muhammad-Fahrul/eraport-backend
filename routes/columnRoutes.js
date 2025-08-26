import express from 'express';
const router = express.Router();

import verifyJWT from '../middleware/verifyJWT.js';
import { permit } from '../middleware/roleVerification.js';
import { addColumn, deleteColumn } from '../controllers/columnController.js';

router.use(verifyJWT);
router.use(permit('mentor'));

router.route('/:raportId').post(addColumn).delete(deleteColumn);

export default router;
