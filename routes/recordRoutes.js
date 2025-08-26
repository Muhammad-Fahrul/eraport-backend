import express from 'express';
const router = express.Router();

import verifyJWT from '../middleware/verifyJWT.js';
import {
  addRecord,
  getRecord,
  deleteRecord,
} from '../controllers/recordController.js';
import {
  authorizeAccessRecords,
  authorizeWriteAccessCollaborator,
  permit,
} from '../middleware/roleVerification.js';
import { isRaportValid } from '../middleware/raportValidation.js';

router.use(verifyJWT);

router.route('/:username/:raportId').get(authorizeAccessRecords, getRecord);

router.use('/:studentId/:raportId', permit('mentor'));
router
  .route('/:studentId/:raportId')
  .post(authorizeWriteAccessCollaborator, isRaportValid, addRecord);
router
  .route('/:studentId/:raportId/:recordId')
  .delete(authorizeWriteAccessCollaborator, deleteRecord);

export default router;
