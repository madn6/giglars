import './config/back.dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import postRoutes from "./routes/post.routes";
import { errorHandler } from './middleware/errrorHandler';
import profileRoutes from './routes/profile.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(errorHandler)

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://192.168.64.14:5173'], // Allow frontend origin
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

app.get('/', (req, res) => {
	res.send("api working")
})




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/profile', profileRoutes);

// Connect to database and start server
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const HOST: string = '0.0.0.0';

connectDB().then(() => {
	app.listen(PORT, HOST, () => {
		console.log(`Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
	});
});
