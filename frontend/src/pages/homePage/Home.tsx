import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPosts } from '../../redux/features/posts/postsSlice';
import { HomeNavigations } from '../../components';
import PostCard from '../../components/home/post/PostCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

const Home = ({ filter = 'all' }: { filter?: 'lucky' | 'unlucky' | 'all' }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky' | 'all'>(filter);
	const dispatch = useAppDispatch();
	const { postItems } = useAppSelector((state) => state.posts);
	const userId = useAppSelector((state) => state.auth.userId);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		setError(null);
		dispatch(fetchPosts({ feeling, userId: userId ?? '' }))
			.unwrap()
			.catch((err: string) => setError(err))
			.finally(() => setLoading(false));
	}, [dispatch, feeling, userId]);

	const handleFeelingFilter = (selectedFeeling: 'lucky' | 'unlucky' | 'all') => {
		setFeeling(selectedFeeling);
	};

	const scrollToIndex = location.state?.scrollToPostId
		? postItems.findIndex((p) => p._id === location.state.scrollToPostId)
		: undefined;

	useEffect(() => {
		if (scrollToIndex !== undefined && scrollToIndex >= 0) {
			setTimeout(() => {
				navigate(location.pathname, { replace: true, state: {} });
			}, 500); // Give time for Virtuoso to scroll first
		}
	}, [scrollToIndex, navigate, location.pathname]);

	return (
		<div className="flex flex-col font-inter h-screen ">
			<HomeNavigations feelingFilter={handleFeelingFilter} />

			<div className="flex-1 pt-20 pb-22 md:pb-4 md:pl-[140px] px-2 md:px-6 mx-auto w-full max-w-3xl ">
				<div className="max-w-2xl w-full h-full ">
					{loading ? (
						<p className="text-center text-white">Loading posts...</p>
					) : error ? (
						<p className="text-center text-red-500">{error}</p>
					) : postItems.length === 0 ? (
						<p className="text-center text-white">No posts available.</p>
					) : (
						<Virtuoso
							useWindowScroll
							totalCount={postItems.length}
							initialTopMostItemIndex={scrollToIndex ?? 0}
							itemContent={(index) => {
								const post = postItems[index];
								if (!post) return null;
								return (
									<div id={`post-${post._id}`} className="mb-4">
										<PostCard
											post={post}
											userData={{
												profileImage: post.userId?.profileImage || '',
												uniqueUsername: post.userId?.uniqueUsername || 'Unknown',
												displayName: post.userId?.displayName || 'Anonymous'
											}}
										/>
									</div>
								);
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
