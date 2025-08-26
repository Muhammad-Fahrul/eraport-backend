import express from 'express';
import {
  addCollaborator,
  getCollaboratorsByMentor,
  getCollaboratorsByUsername,
} from '../controllers/collaboratorController.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { permit } from '../middleware/roleVerification.js';
const router = express.Router();

router.use(verifyJWT);
router.use(permit('mentor'));
router.route('/').post(addCollaborator).get(getCollaboratorsByUsername);
router.route('/collabs').get(getCollaboratorsByMentor);

export default router;
