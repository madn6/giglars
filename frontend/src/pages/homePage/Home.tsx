import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPosts } from '../../redux/features/posts/postsSlice';
import { HomeNavigations } from '../../components';
import PostCard from '../../components/home/post/PostCard';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';

const Home = ({ filter = 'all' }: { filter?: 'lucky' | 'unlucky' | 'all' }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky' | 'all'>(filter);

	const dispatch = useAppDispatch();
	const { postItems } = useAppSelector((state) => state.posts);
	const auth = useAppSelector((state) => state.auth);
	const userId = auth.userId;

	useEffect(() => {
		setFeeling(filter);
	}, [filter]);

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

	const scrollParentRef = useRef<HTMLDivElement | null>(null);

	const rowVirtualizer = useVirtualizer({
		count: postItems.length,
		getScrollElement: () => scrollParentRef.current,
		estimateSize: () => 600,
		overscan: 5
	});

	return (
		<div className="flex flex-col font-inter h-screen">
			<HomeNavigations feelingFilter={handleFeelingFilter} />

			<motion.div
				key={feeling} // Enables transition on feeling change
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="flex-1 py-20 px-2 md:px-6 mx-auto w-full max-w-3xl"
			>
				<div className="max-w-2xl w-full h-full">
					{loading ? (
						<p className="flex items-center justify-center h-screen text-white">
							<img src="/svg/tube-spinner.svg" alt="spinner" className="w-10" />
						</p>
					) : error ? (
						<p className="text-center text-red-500">{error}</p>
					) : postItems.length === 0 ? (
						<p className="text-center text-gray-400 mt-10">No posts found.</p>
					) : (
						// Make scroll container scrollable
						<div
							ref={scrollParentRef}
							className="relative overflow-auto"
						>
							<div
								style={{
									height: `${rowVirtualizer.getTotalSize()}px`,
									position: 'relative'
								}}
							>
								{rowVirtualizer.getVirtualItems().map((virtualRow) => {
									const post = postItems[virtualRow.index];
									return (
										<div
											key={post._id}
											id={`post-${post._id}`}
											ref={(el) => {
												if (el) rowVirtualizer.measureElement(el);
											}}
											data-index={virtualRow.index}
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												transform: `translateY(${virtualRow.start}px)`
											}}
										>
											<PostCard
												post={post}
												userData={{
													profileImage: post.userId?.profileImage || '',
													uniqueUsername: post.userId?.uniqueUsername || 'Unknown',
													displayName: post.userId?.displayName || 'Anonymous'
												}}
												currentUser={{
													userId: auth.userId!,
													email: auth.email!,
													name: auth.name!,
													profileImage: auth.profileImage!,
													isLoggedIn: auth.isLoggedIn
												}}
											/>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default Home;
