import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { setPosts } from '../redux/features/posts/postsSlice';
import { Post } from '../redux/features/posts/postTypes';

import { HomeNavigations } from '../components';

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
			<HomeNavigations />
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
