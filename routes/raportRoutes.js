import express from 'express';
const router = express.Router();

import verifyJWT from '../middleware/verifyJWT.js';
import {
  createRaport,
  createRaportRelation,
  deleteRaportById,
  getRaportById,
  getRaportsByMentorId,
  updateRaportById,
} from '../controllers/raportController.js';
import { permit } from '../middleware/roleVerification.js';

router.use(verifyJWT);
router.use('/mentor', permit('mentor'));

router.route('/mentor').get(getRaportsByMentorId).post(createRaport);

router
  .route('/mentor/:raportId')
  .get(getRaportById)
  .put(updateRaportById)
  .delete(deleteRaportById);

router.route('/mentor/:raportId/relation').post(createRaportRelation);

export default router;
