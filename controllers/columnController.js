import Column from '../models/columnModel.js';
import Raport from '../models/raportModel.js';
import asyncHandler from 'express-async-handler';

const addColumn = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const raportId = req.params.raportId;

  const raport = await Raport.findOne({ _id: raportId, userId });

  if (!raport) {
    return res.status(404).json({ message: 'raport not found' });
  }

  if (raport.valid) {
    return res.status(400).json({
      message: 'this raport is immutable because it is already validated',
    });
  }

  const duplicate = await Column.findOne({
    columnName: req.body.columnName,
    raportId: raport._id,
  });

  if (duplicate) {
    return res.status(400).json({ message: 'duplicate column' });
  }

  const newColumn = await Column.create({
    ...req.body,
    raportId,
  });

  raport.columns.push(newColumn._id);

  await raport.save();

  return res.json({
    message: 'new column successfully added',
  });
});

const deleteColumn = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const raportId = req.params.raportId;
  const columnId = req.body.columnId;

  const raport = await Raport.findOne({ _id: raportId, userId });

  if (!raport) {
    return res.status(404).json({ message: 'raport not found' });
  }

  if (raport.valid) {
    return res.status(400).json({
      message: 'this raport is immutable because it is already validated',
    });
  }

  const column = await Column.findById(columnId);

  if (!column) {
    return res.status(400).json({ message: 'input not found' });
  }

  await column.deleteOne();

  const newColumns = raport.columns.filter((id) => id.toString() !== columnId);

  raport.columns = newColumns;

  await raport.save();

  res.json({ message: 'column deleted' });
});

export { addColumn, deleteColumn };
