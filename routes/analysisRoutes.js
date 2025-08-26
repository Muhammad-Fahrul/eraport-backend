import express from 'express';
import {
  getRecordsAnalysisArrayType,
  getRecordsAnalysisBoelType,
} from '../controllers/analysisController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { permit } from '../middleware/roleVerification.js';
const router = express.Router();

router.use(verifyJWT);

router.use(permit('mentor'));
router.get('/', getRecordsAnalysisBoelType);
router.get('/array', getRecordsAnalysisArrayType);

export default router;
