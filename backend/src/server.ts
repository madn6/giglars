import './config/back.dotenv';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
// import postRoutes from "./routes/postRoutes";
// import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173', // Allow frontend origin
		credentials: true // Allow cookies & authentication headers
	})
);


// Routes
app.use('/api/auth', authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);

// Connect to database and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
