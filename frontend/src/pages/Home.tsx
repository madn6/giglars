import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';



const Home: React.FC = () => {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Left Sidebar - Fixed on Large Screens, Bottom on Small Screens */}
			<nav
				className="bg-black text-white py-5 fixed bottom-0 w-full flex justify-around 
                md:w-[120px] md:h-auto md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-6
				
				"
			>
				<ul className="flex w-full justify-around md:flex-col md:w-auto md:items-center md:space-y-6">
					<li>
						<Link to="/lucky">
							<img className="w-7" src="../../public/images/clover.png" alt="Lucky" />
						</Link>
					</li>
					<li>
						<Link to="/unlucky">
							<img className="w-7" src="../../public/images/black-cat.png" alt="Unlucky" />
						</Link>
					</li>
					<li>
						<Link to="/submit">
							<img className="w-8" src="../../public/images/post.png" alt="Submit" />
						</Link>
					</li>
					<li>
						<Link to="/search">
							<img className="w-8" src="../../public/images/search.png" alt="Search" />
						</Link>
					</li>
					<li>
						<Link to="/login">
							<img className="w-8" src="../../public/images/user.png" alt="User" />
						</Link>
					</li>
				</ul>
			</nav>

			{/* Main Content - Fully Centered and Scrollable */}
			<div className="flex flex-1 justify-center items-start md:ml-[120px] mt-20 h-screen overflow-y-auto px-6">
				<div className="max-w-4xl w-full text-red-600">
					<p>
						<div className="">
							<PostCard />
						</div>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
