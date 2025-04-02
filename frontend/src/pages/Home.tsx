import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';


const Home: React.FC = () => {
	const posts = useSelector((state: RootState) => state.posts)
	console.log(posts)
	return (
		<div className="flex flex-col min-h-screen">
			{/* Left Sidebar - Fixed on Large Screens, Bottom on Small Screens */}
			<nav
				className="bg-primary text-white py-5 fixed bottom-0 w-full flex justify-around 
                md:w-[120px] md:h-auto md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-6
				
				"
			>
				<ul className="flex w-full justify-around md:flex-col md:w-auto md:items-center md:space-y-6">
					<li>
						<Link to="/lucky">
							<img className="w-7" src="/images/clover.png" alt="Lucky" />
						</Link>
					</li>
					<li>
						<Link to="/unlucky">
							<img className="w-7" src="/images/black-cat.png" alt="Unlucky" />
						</Link>
					</li>
					<li>
						<Link to="/submit">
							<img className="w-8" src="/images/post.png" alt="Submit" />
						</Link>
					</li>
					<li>
						<Link to="/search">
							<img className="w-8" src="/images/search.png" alt="Search" />
						</Link>
					</li>
					<li>
						<Link to="/login">
							<img className="w-8" src="/images/user.png" alt="User" />
						</Link>
					</li>
				</ul>
			</nav>

			{/* Main Content - Fully Centered and Scrollable */}
			<div className="flex justify-center items-start md:ml-[120px] py-20 h-screen overflow-y-auto px-2 md:px-6">
				<div className="max-w-2xl w-full">
					<div className="grid grid-cols-1  gap-4">
						{posts.map((post, index) => (
							<PostCard key={index} post={post} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
