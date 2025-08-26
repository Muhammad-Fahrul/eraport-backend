import Raport from '../models/raportModel.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const createRaport = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { raportName } = req.body;

  const name = raportName.toLocaleLowerCase();

  const duplicateRaport = await Raport.findOne({
    name,
    userId,
  });

  if (duplicateRaport) {
    return res.status(400).json({ message: 'duplicate Raport Name' });
  }

  const raport = new Raport({
    name,
    userId,
  });

  await raport.save();

  res.status(201).json({ message: 'new schema added' });
});

const getRaportById = asyncHandler(async (req, res) => {
  const { raportId } = req.params;

  const raport = await Raport.findById(raportId).populate('columns');

  if (!raport) {
    return res.status(400).json({ message: 'raport not found' });
  }

  const { valid, columns } = raport;

  res.json({ valid, columns });
});

const getRaportsByMentorId = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const raports = await Raport.find({ userId, status: true });

  if (!raports) {
    throw new Error('raport not found');
  }

  res.json({ raports });
});

const updateRaportById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const raportId = req.params.raportId;

  const raport = await Raport.findOne({ _id: raportId, userId });

  if (!raport) {
    return res.status(404).json({ message: 'raport not found' });
  }

  if (raport.columns.length < 3) {
    return res
      .status(400)
      .json({ message: 'raport form should have 3 item to validate' });
  }

  raport.valid = true;

  await raport.save();

  res.json({ message: 'raport form updated' });
});

const deleteRaportById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const raportId = req.params.raportId;

  const raport = await Raport.findOne({ _id: raportId, userId });

  if (!raport) {
    return res.status(404).json({ message: 'raport not found' });
  }

  raport.status = false;

  await raport.save();

  res.json({ message: 'raport berhasil dihapus' });
});

const createRaportRelation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { raportId } = req.params;
  const { username } = req.body;

  const raport = await Raport.findOne({ _id: raportId, userId });

  if (!raport) {
    return res.status(400).json({ message: 'raport not found' });
  }

  const student = await User.findOne({ username, mentorId: userId });

  if (!student) {
    return res.status(400).json({ message: 'raport not found' });
  }

  student.raportIdsStudent.push({
    raportId: raport._id,
    raportName: raport.name,
  });

  await student.save();

  res.json({ message: 'raport sukses dikaitkan' });
});

export {
  getRaportById,
  getRaportsByMentorId,
  createRaport,
  updateRaportById,
  deleteRaportById,
  createRaportRelation,
};
