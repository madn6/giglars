import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, SignUp } from './pages';
import { Navbar } from './components';
import { SignIn } from './pages'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const App: React.FC = () => {
	return (
		<div className="">
			<ToastContainer autoClose={ 3000} position='bottom-center' />
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
