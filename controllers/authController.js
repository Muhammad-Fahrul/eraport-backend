import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import UserValidator from '../validator/user/index.js';
import InvariantError from '../error/InvariantError.js';

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  UserValidator.validateAuthPayload({ username, password });

  let foundUser = await User.findOne({ username });

  if (!foundUser) {
    throw new InvariantError('Invalid Username');
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) {
    throw new InvariantError('Invalid Password');
  }

  const accessToken = jwt.sign(
    {
      user: {
        id: foundUser._id,
        username: foundUser.username,
        role: foundUser.role,
        urlImg: foundUser.urlImgProfile,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15s' }
  );

  const refreshToken = jwt.sign(
    {
      user: {
        username: foundUser.username,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '3d' }
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 3 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(201).json({ data: { accessToken } });
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({
        username: decoded.user.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          user: {
            id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role,
            urlImg: foundUser.urlImgProfile,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s' }
      );

      res.json({ accessToken });
    })
  );
});

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

export { login, logout, refresh };
