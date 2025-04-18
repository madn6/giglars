import './config/back.dotenv';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import postRoutes from "./routes/postRoutes";
// import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://192.168.240.147:5173'], // Allow frontend origin
		credentials: true // Allow cookies & authentication headers
	})
);

app.get("/api/test", (_req,res) => {
	res.send("i can see from my mobile...")
})

app.get('/api/debug-cookies', (req, res) => {
	console.log('Cookies from client:', req.cookies);
	res.send(req.cookies);
});


// Routes
app.use('/api/auth', authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);

// Connect to database and start server
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const HOST: string = '0.0.0.0';

connectDB().then(() => {
	app.listen(PORT, HOST, () => {
		console.log(`Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
	});
});
