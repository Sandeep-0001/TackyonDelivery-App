import dotenv from 'dotenv';
dotenv.config(); // Load .env variables FIRST before any other imports

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI!; // "!" tells TypeScript it's not undefined

mongoose.connect(MONGO_URI) //  removed old options
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
