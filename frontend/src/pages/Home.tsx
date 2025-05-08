import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { setPosts } from '../redux/features/posts/postsSlice';
import { Post } from '../redux/features/posts/postTypes';
import { MdOutlineAddCircle } from 'react-icons/md';
import { PiCloverFill } from 'react-icons/pi';
import { BiSearchAlt } from 'react-icons/bi';
import { GiDogHouse } from 'react-icons/gi';

const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	return (
		<div className="flex flex-col  font-inter min-h-screen">
			{/* Left Sidebar - Fixed on Large Screens, Bottom on Small Screens */}
			<nav
				className="bg-primary border-t md:border-l-0 md:border-t md:border-b md:border-r z-50 :border-b border-border/20 text-white py-5 fixed bottom-0 w-full flex justify-around 
               md:w-[120px] md:h-[350px] md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-6 
               rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none
               md:rounded-tl-none md:rounded-bl-none md:rounded-tr-xl md:rounded-br-xl"
			>
				<ul className="flex w-full justify-around md:flex-col md:w-auto md:items-center md:space-y-6">
					<li>
						<Link to="/login">
							<GiDogHouse size={24} />
						</Link>
					</li>
					<li>
						<Link to="/lucky">
							<PiCloverFill size={24} />
						</Link>
					</li>
					<li>
						<Link to="/unlucky">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
								<path
									fill="currentColor"
									fillRule="evenodd"
									d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464m4.933 13.983a.75.75 0 0 0 1.05.155A4.27 4.27 0 0 1 12 16.75a4.27 4.27 0 0 1 2.553.852a.75.75 0 1 0 .894-1.204A5.77 5.77 0 0 0 12 15.25a5.77 5.77 0 0 0-3.447 1.148a.75.75 0 0 0-.156 1.049M16 10.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5M9 12c.552 0 1-.672 1-1.5S9.552 9 9 9s-1 .672-1 1.5s.448 1.5 1 1.5"
									clipRule="evenodd"
								></path>
							</svg>
						</Link>
					</li>
					<li>
						<Link to="/create-post">
							<MdOutlineAddCircle size={24} />
						</Link>
					</li>
					<li>
						<Link to="/search">
							<BiSearchAlt size={24} />
						</Link>
					</li>
				</ul>
			</nav>

			{/* Main Content - Fully Centered and Scrollable */}
			<div className="flex-1 h-full pt-20 pb-22 md:pl-[140px] px-2 md:px-6 mx-auto w-full max-w-3xl overflow-y-auto">
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
