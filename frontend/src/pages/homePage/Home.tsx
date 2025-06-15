import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPosts } from '../../redux/features/posts/postsSlice';
import { HomeNavigations, PostCard } from '../../components';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import CommentDrawer from '../../components/home/post/interactionButtons/comment/CommentDrawer';

export default function Home({ filter = 'all' }: { filter?: 'lucky' | 'unlucky' | 'all' }) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky' | 'all'>(filter);

	const dispatch = useAppDispatch();
	const { postItems } = useAppSelector((state) => state.posts);
	const auth = useAppSelector((state) => state.auth);
	const userId = auth.userId;

	const [drawerPostId, setDrawerPostId] = useState<string | null>(null);
	const [drawerPostAuthorId, setDrawerPostAuthorId] = useState<string | null>(null);

	const openComments = (postId: string, authorId: string) => {
		setDrawerPostId(postId);
		setDrawerPostAuthorId(authorId);
	};

	const closeComments = () => {
		setDrawerPostId(null);
		setDrawerPostAuthorId(null);
	};

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

	const rowVirtualizer = useWindowVirtualizer({
		count: postItems.length,
		estimateSize: () => 657,
		overscan: 5,
		measureElement: (el) => el.getBoundingClientRect().height
	});

	//  Place this RIGHT BELOW the rowVirtualizer definition
	const measureRef = useCallback(
		(el: HTMLDivElement | null) => {
			if (el) rowVirtualizer.measureElement(el);
		},
		[rowVirtualizer]
	);

	return (
		<div className="flex flex-col font-inter h-screen">
			<HomeNavigations feelingFilter={handleFeelingFilter} />

			<motion.div
				key={feeling} // Enables transition on feeling change
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="flex-1 pt-20 md:pb-0 pb-18 lg:pl-0  md:pl-[140px]  px-2 md:px-6 mx-auto w-full  lg:max-w-2xl md:max-w-3xl"
			>
				<div className=" w-full h-full">
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
						<div className="relative ">
							<div
								style={{
									height: `${rowVirtualizer.getTotalSize()}px`,
									position: 'relative'
								}}
							>
								{rowVirtualizer.getVirtualItems().map((virtualRow) => {
									const index = virtualRow.index;
									if (index >= postItems.length || index < 0) return null;

									const post = postItems[virtualRow.index];
									if (!post) return null;
									return (
										<div
											key={post._id}
											id={`post-${post._id}`}
											ref={measureRef}
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
												onCommentClick={() => {
													const postId = post._id;
													const authorId = post.userId?._id;
													if (!postId || !authorId) return; // Optional: Show error/toast/log
													openComments(postId, authorId);
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
			{/* Drawer appears at the root level */}
			{drawerPostId && drawerPostAuthorId && (
				<CommentDrawer
					postId={drawerPostId}
					postAuthorId={drawerPostAuthorId}
					currentUser={{
						userId: auth.userId ?? '',
						email: auth.email ?? '',
						name: auth.name ?? '',
						profileImage: auth.profileImage ?? '',
						isLoggedIn: auth.isLoggedIn ?? false
					}}
					onClose={closeComments}
				/>
			)}
		</div>
	);
}
