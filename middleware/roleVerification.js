import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { canManageStudent } from '../utils/authorization.js';

const permit = (...allowed) => {
  return (req, res, next) => {
    const { user } = req;
    if (user && allowed.includes(user.role)) {
      next();
    } else {
      res.status(403).send({ message: 'Forbidden' });
    }
  };
};

const authorizeAccessRecords = asyncHandler(async (req, res, next) => {
  const { id: userId, role } = req.user;

  const { username } = req.params;

  const student = await User.findOne({ username }).select('-password').exec();

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (role === 'mentor') {
    const isAuthorized = await canManageStudent(userId, student);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: 'Not authorized to manage this student' });
    }
  } else if (student._id.toString() !== userId.toString()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.student = student;
  next();
});

const authorizeWriteAccessCollaborator = asyncHandler(
  async (req, res, next) => {
    const mentorId = req.user.id;
    const { studentId } = req.params;

    const student = await User.findById(studentId).select('-password').exec();

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    }

    const isAuthorized = await canManageStudent(mentorId, student);
    if (!isAuthorized) {
      return res
        .status(401)
        .json({ message: 'Not authorized to manage this student' });
    }

    req.student = student;
    next();
  }
);

export { permit, authorizeAccessRecords, authorizeWriteAccessCollaborator };
