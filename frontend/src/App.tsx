import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, SignUp } from './pages';
import { Navbar } from './components';
import{SignIn} from './pages'

const App: React.FC = () => {
	return (
		<div className="">
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
