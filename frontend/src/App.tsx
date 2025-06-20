import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { CreatePost, Dashboard, Home, ProfileSetup, SignIn, SignUp, UpdateProfile } from './pages';
import Navbar from './components/navbar/Navbar';
import { checkAuth } from './api/axiosInstance';
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch } from './redux/store/store';

const AppContent: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		checkAuth(dispatch);
	}, [dispatch]);

	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home filter="all" />} />
				<Route path="/lucky" element={<Home filter="lucky" />} />
				<Route path="/unlucky" element={<Home filter="unlucky" />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/create-post" element={<CreatePost />} />
				<Route path="/profile-setup" element={<ProfileSetup />} />
				<Route path="/update-profile" element={<UpdateProfile />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</>
	);
};

const App: React.FC = () => {
	return (
		<>
			<ToastContainer autoClose={3000} position="bottom-center" />
			<Router>
				<AppContent />
			</Router>
		</>
	);
};

export default App;
