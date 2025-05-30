import PostCard from '../../components/home/post/PostCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../../redux/features/posts/postsSlice';
import { HomeNavigations } from '../../components';

type HomeProps = {
	filter?: 'lucky' | 'unlucky' | 'all';
};

const Home: React.FC<HomeProps> = ({ filter = 'all' }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky' | 'all'>(filter);
	const dispatch = useAppDispatch();
	const { postItems } = useAppSelector((state) => state.posts);
	const userId = useAppSelector((state) => state.auth.userId);

	console.log('posts', postItems);

	useEffect(() => {
		if (!userId) return;
		setLoading(true);
		setError(null);

		dispatch(fetchPosts({ feeling, userId }))
			.unwrap()
			.catch((err: string) => {
				setError(err);
			})
			.finally(() => setLoading(false));
	}, [dispatch, feeling, userId]);

	const handleFeelingFilter = (selectedFeeling: 'lucky' | 'unlucky' | 'all') => {
		setFeeling(selectedFeeling);
	};

	return (
		<div className="flex flex-col  font-inter min-h-screen">
			<HomeNavigations feelingFilter={handleFeelingFilter} />
			{/* Main Content - Fully Centered and Scrollable */}
			<div className="flex-1 h-full pt-20 pb-22 md:pl-[140px] px-2 md:px-6 mx-auto w-full max-w-3xl overflow-y-auto">
				<div className="max-w-2xl w-full">
					<div className="grid grid-cols-1 gap-4">
						{loading ? (
							<p className="text-center text-white">Loading posts...</p>
						) : error ? (
							<p className="text-center text-red-500">{error}</p>
						) : (
							postItems.map((post) => (
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
