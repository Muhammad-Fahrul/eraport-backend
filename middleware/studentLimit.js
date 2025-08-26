import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const hasReachedLimit = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // or req.user if mentor is logged in

  const mentor = await User.findById(userId);

  // Count the number of students associated with this mentor
  const studentCount = await User.countDocuments({ mentorId: mentor._id });

  // Check if the mentor has reached the limit
  if (studentCount >= 100) {
    return res.status(403).json({
      message: 'Student limit reached. Please upgrade your package.',
    });
  }

  // If all checks pass, move to the next middleware or controller
  next();
});

export { hasReachedLimit };
