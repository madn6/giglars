import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import { Navbar } from './components';

const App: React.FC = () => {
	return (
		<div className="">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
