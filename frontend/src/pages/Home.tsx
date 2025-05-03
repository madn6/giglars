import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { Post, setPosts } from '../redux/features/posts/postsSlice';

const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// interface UserData {
	// 	profileImage: string;
	// 	displayName: string;
	// 	uniqueUsername: string;
	// }

	// const [userData, setUserData] = useState<UserData | null>(null);

	const dispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);

	console.log('posts', posts);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await API.get('/api/post/get-all-posts');
				console.log('PostCard received post:', res.data);
				dispatch(
					setPosts(
						res.data.posts.map((post: Post) => ({
							...post,
							stats: {
								luck: post.stats?.luck ?? 0,
								comments: post.stats?.comments ?? 0,
								caps: post.stats?.caps ?? 0,
								saves: post.stats?.saves ?? 0,
								shares: post.stats?.shares ?? 0
							}
						}))
					)
				);
			} catch (error) {
				console.error('Failed to fetch posts:', error);
				setError('Failed to load posts.');
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [dispatch]);

	// useEffect(() => {
	// 	// Fetch user data on component mount
	// 	const fetchUserData = async () => {
	// 		try {
	// 			const response = await API.get('/api/auth/user-info', {
	// 				withCredentials: true // Include credentials for authentication
	// 			}); // Update the URL to your actual endpoint
	// 			setUserData(response.data); // Store the response in state
	// 		} catch (error) {
	// 			console.error('Error fetching user data:', error);
	// 		}
	// 	};

	// 	fetchUserData();
	// }, []);

	// console.log('User Data:', userData); // Log the user data to check if it's being fetched correctly

	return (
		<div className="flex flex-col  font-inter min-h-screen">
			{/* Left Sidebar - Fixed on Large Screens, Bottom on Small Screens */}
			<nav
				className="bg-[#081420] border-t md:border-l-0 md:border-t md:border-r md:border-b border-border/20 text-white py-5 fixed bottom-0 w-full flex justify-around 
               md:w-[120px] md:h-[350px] md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-6 
               rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none
               md:rounded-tl-none md:rounded-bl-none md:rounded-tr-xl md:rounded-br-xl"
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
						<Link to="/create-post">
							<img className="w-9" src="/images/post.png" alt="Submit" />
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
					<div className="grid grid-cols-1 gap-4">
						{loading ? (
							<p className="text-center text-white">Loading posts...</p>
						) : error ? (
							<p className="text-center text-red-500">{error}</p>
						) : (
							posts.map((post) => (
								<PostCard
									key={post._id}
									post={post}
									userData={{
										profileImage: post.userId?.profileImage || '', // fallback to empty string if undefined
										uniqueUsername: post.userId?.uniqueUsername || 'Unknown', // fallback
										displayName: post.userId?.displayName || 'Anonymous' // fallback
									}}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
