import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Home: React.FC = () => {
	const dummyData = [
		{
			image: '/images/user.png',
			name: 'maddy69',
			username: '@mathanmuthukani',
			time: '2d',
			postText:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt consectetur nemo omnis animi necessitatibus eos nisi nam vitae repellat quas sint sed aut magnam, eius, eveniet debitis itaque natus tempore.',
			postImage:
				'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg',
			stats: { luck: 32400, comments: 2400, caps: 566, saves: 566, shares: 34000 }
		},
		{
			image: '/images/user.png',
			name: 'ramya',
			username: '@ramya6868',
			time: '1h',
			postText: 'Reiciendis ea commodi maiores.',
			postImage:
				'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?cs=srgb&dl=pexels-fauxels-3183197.jpg&fm=jpg',
			stats: { luck: 10400, comments: 1300, caps: 232, saves: 400, shares: 12000 }
		}
	];

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
						{dummyData.map((post, index) => (
							<PostCard key={index} post={post} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
