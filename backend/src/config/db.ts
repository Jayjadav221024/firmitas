import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shreeraj_traders';
  try {
    await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected to ${uri}`);
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed or running in in-memory/mock fallback mode:`, error);
  }
}
