import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { Home, SignIn, SignUp } from './pages';
import { Navbar } from './components';
import { checkAuth } from './api/axiosInstance'; // adjust the path as needed
import 'react-toastify/dist/ReactToastify.css';

// ✅ This inner component is rendered inside <Router>
const AppContent: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		checkAuth(dispatch, navigate);
	}, [dispatch, navigate]);

	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
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
