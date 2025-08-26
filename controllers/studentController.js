import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import UserValidator from '../validator/user/index.js';
import Record from '../models/recordModel.js';
import fs from 'fs';
import csv from 'csv-parser';
import User from '../models/userModel.js';
import Group from '../models/groupModel.js';
import InvariantError from '../error/InvariantError.js';

const createNewStudent = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  UserValidator.validateUserPayload({ username, password });

  let student = await User.findOne({ username }).lean().exec();

  if (student) {
    return res.status(400).json({ message: 'User already exists' });
  }

  student = new User({
    username,
    password,
    role: 'student',
    mentorId: req.user.id,
  });

  const salt = await bcrypt.genSalt(10);

  student.password = await bcrypt.hash(password, salt);

  await student.save();

  if (student) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

const getStudentsByMentorId = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find students directly managed by the authenticated mentor
  const managedStudents = await User.find({ mentorId: userId }).select(
    '-password'
  );

  // Find mentors who have added the authenticated mentor as a collaborator
  const mentors = await User.find({ 'collaborators.userId': userId }).select(
    '_id'
  );

  const mentorIds = mentors.map((mentor) => mentor._id);

  // Find students managed by those mentors
  const collaboratorStudents = await User.find({
    mentorId: { $in: mentorIds },
  }).select('-password');

  // Combine the lists of students
  const allStudents = [...managedStudents, ...collaboratorStudents];
  const currentDate = new Date();

  for (const user of allStudents) {
    const lastPracticeDate = new Date(user.lastPracticeDate);
    const daysSinceLastPractice = Math.floor(
      (currentDate - lastPracticeDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPractice > 1) {
      // User missed a day, reset streak
      user.currentStreakCount = 0;
      await user.save();
    }
  }

  return res.json({ students: allStudents });
});

const deleteStudentById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username } = req.params;

  const student = await User.findOne({ username, mentorId: userId })
    .select('-password')
    .exec();

  if (!student) {
    return res.status(404).json({ message: 'student not found' });
  }

  await Record.deleteMany({ studentId: student._id });

  const result = await student.deleteOne();

  res.json({
    message: `Username ${result.username} with ID ${result._id} deleted`,
  });
});

const createNewStudents = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const users = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      try {
        const hashedUsers = await Promise.all(
          users.map(async (user) => {
            const { username, password } = user;

            let existingUser = await User.findOne({ username }).lean().exec();
            if (existingUser) {
              return null; // Skip if user already exists
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            return {
              username,
              password: hashedPassword,
              role: 'student',
              mentorId: req.user.id,
            };
          })
        );

        const validUsers = hashedUsers.filter((user) => user !== null);

        await User.insertMany(validUsers);

        fs.unlinkSync(file.path);
        res.status(201).json({ message: 'Users added successfully' });
      } catch (err) {
        fs.unlinkSync(file.path);
        res.status(500).json({ message: 'Failed to process file' });
      }
    });
});

const groupStudents = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { groupName } = req.body;

  const existGroup = await Group.findOne({ groupName, userId }).lean().exec();

  if (existGroup) {
    return InvariantError('Group already exist');
  }

  await Group.create({
    groupName,
    userId,
  });

  res.status(201).json({ message: 'group created' });
});

const addStudentsToGroup = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { groupId, students } = req.body;

  const group = await Group.findOne({ _id: groupId, userId }).exec();

  if (!group) {
    return InvariantError('group is not found');
  }

  if (!students.length) {
    return InvariantError('at least on student');
  }

  let newStds = group.students;

  students.forEach((s) => {
    const sExist = group.students.some((sF) => s.id === sF.id.toString());

    if (!sExist) {
      newStds.push(s);
    }
  });

  group.students = newStds;

  await group.save();

  res.json({ status: 'success', message: 'students added' });
});

const getGroupsStudent = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const groups = await Group.find({ userId }).exec();

  res.json({ groups });
});

const getGroupById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const group = await Group.findOne({ _id: groupId, userId }).exec();

  if (!group) {
    return InvariantError('Group isnt exist');
  }

  res.json({ group });
});

export {
  createNewStudent,
  getStudentsByMentorId,
  deleteStudentById,
  createNewStudents,
  groupStudents,
  addStudentsToGroup,
  getGroupsStudent,
  getGroupById,
};
