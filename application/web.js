import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import corsOption from '../config/corsOption.js';
import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import studentRoutes from '../routes/studentRoutes.js';
import raportRoutes from '../routes/raportRoutes.js';
import columnRoutes from '../routes/columnRoutes.js';
import recordRoutes from '../routes/recordRoutes.js';
import analysisRoutes from '../routes/analysisRoutes.js';
import collaboratorRoutes from '../routes/collaboratorRoutes.js';

import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import credentials from '../middleware/credentials.js';

const app = express();
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/raports', raportRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/collaborators', collaboratorRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
