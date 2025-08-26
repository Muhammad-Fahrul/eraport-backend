import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const UserCollectionHelper = {
  async addUser({ username = 'test12345', password = 'test12345' }) {
    const salt = await bcrypt.genSalt(10);
    const newUser = new User({
      username,
      password: await bcrypt.hash(password, salt),
      role: 'mentor',
    });

    await newUser.save();
  },

  async getAccessToken() {
    const user = await User.findOne({ username: 'test12345' });
    return jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15s' }
    );
  },

  async getRefreshToken() {
    const user = await User.findOne({ username: 'test12345' });
    return jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '15s' }
    );
  },

  async deleteUser() {
    await User.deleteMany({ username: 'test12345' });
  },
};
