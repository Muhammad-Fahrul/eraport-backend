import express from 'express';
import multer from 'multer';
const router = express.Router();

import {
  createNewStudent,
  deleteStudentById,
  getStudentsByMentorId,
  createNewStudents,
  groupStudents,
  addStudentsToGroup,
  getGroupsStudent,
  getGroupById,
} from '../controllers/studentController.js';
import path from 'path';

import verifyJWT from '../middleware/verifyJWT.js';
import { permit } from '../middleware/roleVerification.js';
import { hasReachedLimit } from '../middleware/studentLimit.js';

const uploadStudentsCSV = multer({ dest: path.join('/tmp') });

router.use(verifyJWT);
router.use(permit('mentor'));
router
  .route('/')
  .get(getStudentsByMentorId)
  .post(hasReachedLimit, createNewStudent);
router.post('/multiple', uploadStudentsCSV.single('file'), createNewStudents);

router.use('/:username', permit('mentor'));
router.route('/:username').delete(deleteStudentById);

router.get('/group/:groupId', getGroupById);
router
  .route('/group')
  .post(groupStudents)
  .put(addStudentsToGroup)
  .get(getGroupsStudent);

export default router;
