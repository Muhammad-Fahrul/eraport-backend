import mongoose from 'mongoose';

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  urlImgProfile: {
    type: String,
    default: null,
  },
  raportIdsStudent: [
    {
      raportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Raport',
      },
      raportName: {
        type: String,
      },
    },
  ],
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
});

user.add({
  currentStreakCount: {
    type: Number,
    default: 0,
  },
  lastPracticeDate: {
    type: Date,
    default: new Date(0),
  },
});

user.methods.getStudentCount = async function (mentorId) {
  const studentCount = await mongoose.models.User.countDocuments({
    mentorId: mentorId,
  });

  if (studentCount >= 3) {
    return false;
  }

  return true;
};

const User = mongoose.models.User || mongoose.model('User', user);

export default User;
