import mongoose from 'mongoose';
const { connect, connection } = mongoose;

import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // MongoDB connection options for local development
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const conn = await connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Optional: Log when connection is ready
    connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    // Handle connection errors after initial connection
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Handle disconnection
    connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

export default connectDB;