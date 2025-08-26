// utils/authorization.js
import User from '../models/userModel.js';

const canManageStudent = async (mentorId, student) => {
  const isOwner = await User.findOne({ _id: student._id, mentorId })
    .lean()
    .exec();

  if (isOwner) return true;

  const mentor = await User.findById(student.mentorId)
    .select('collaborators')
    .exec();

  return mentor.collaborators.some(
    (collab) => collab.userId.toString() === mentorId
  );
};

export { canManageStudent };
