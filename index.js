import dotenv from 'dotenv';
dotenv.config();
import app from './application/web.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
