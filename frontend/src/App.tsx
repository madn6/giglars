import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Home, SignIn, SignUp } from './pages';
import { Navbar } from './components';
import { checkAuth } from './api/axiosInstance'; 
import 'react-toastify/dist/ReactToastify.css';

const AppContent: React.FC = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		checkAuth(dispatch);
	}, [dispatch ]);

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
