import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Handler to add a collaborator
const addCollaborator = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const { collaboratorId } = req.body;

  // Ensure both IDs are provided
  if (!mentorId || !collaboratorId) {
    return res
      .status(400)
      .json({ message: 'mentorId and collaboratorId are required' });
  }

  const mentor = await User.findById(mentorId)
    .select('role collaborators')
    .exec();
  const collaborator = await User.findById(collaboratorId)
    .select('username role')
    .exec();

  if (!mentor || !collaborator) {
    return res
      .status(404)
      .json({ message: 'Mentor or Collaborator not found' });
  }

  // Check if both users are mentors
  if (mentor.role !== 'mentor' || collaborator.role !== 'mentor') {
    return res.status(400).json({ message: 'Both users must be mentors' });
  }

  // Check if the collaborator is already added
  if (
    mentor.collaborators.some((collab) => collab.userId.equals(collaboratorId))
  ) {
    return res.status(400).json({ message: 'Collaborator already added' });
  }

  // Add collaborator
  mentor.collaborators.push({
    userId: collaboratorId,
    username: collaborator.username,
  });

  await mentor.save();

  res.status(200).json({ message: 'Collaborator added successfully' });
});

const getCollaboratorsByUsername = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username parameter is required' });
  }

  const users = await User.find({
    username: { $regex: username, $options: 'i' }, // case-insensitive search
    role: 'mentor',
    _id: { $ne: userId }, // exclude the current user
  }).select('_id username');

  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'No users found' });
  }

  res.json({ users });
});

const getCollaboratorsByMentor = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user.id)
    .select('collaborators')
    .exec();

  res.json({ collaborators: mentor.collaborators });
});

export {
  addCollaborator,
  getCollaboratorsByUsername,
  getCollaboratorsByMentor,
};
