// // api/index.js
// import app from '../src/app.js';   // note the .js extension
// export default app;


// api/index.js
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error. Please try again later.',
    });
  }
}

