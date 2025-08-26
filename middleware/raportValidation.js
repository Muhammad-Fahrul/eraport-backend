import asyncHandler from 'express-async-handler';
import Raport from '../models/raportModel.js';

const isRaportValid = asyncHandler(async (req, res, next) => {
  const { raportId } = req.params;
  const { student } = req;

  const selectedRaportId = student.raportIdsStudent.filter(
    (r) => r.raportId.toString() === raportId
  )[0].raportId;

  const raport = await Raport.findById(selectedRaportId).populate('columns');

  if (!raport) {
    return res.status(400).json({ message: 'raport not found' });
  }

  if (!raport.valid) {
    return res
      .status(400)
      .json({ message: 'Buku raport ini belum divalidasi' });
  }

  req.raport = raport;
  next();
});

export { isRaportValid };
