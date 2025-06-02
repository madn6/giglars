import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPosts } from '../../redux/features/posts/postsSlice';
import { PostCard } from '../../components';
import CommentSection from '../../components/home/post/interactionButtons/comment/CommentSection';

export default function CommentPage() {
	const { postId } = useParams<{ postId: string }>();
	const dispatch = useAppDispatch();

	const auth = useAppSelector((state) => state.auth);
	const post = useAppSelector((state) => state.posts.postItems.find((p) => p._id === postId));
	useEffect(() => {
		if (!post && postId && auth.userId) {
			dispatch(fetchPosts({ userId: auth.userId, feeling: 'all' }));
		}
	}, [dispatch, post, postId, auth.userId]);

	if (!post) return <p className="p-4 text-white">Loading post...</p>;

	const currentUser = {
		userId: auth.userId ?? '',
		email: auth.email ?? '',
		name: auth.name ?? '',
		profileImage: auth.profileImage ?? '',
		isLoggedIn: auth.isLoggedIn
	};

	return (
		<div className="flex flex-col font-inter text-white min-h-screen">
			<div className="flex-1 pt-20 pb-14 px-2 md:px-6 mx-auto w-full max-w-3xl">
				<div className="max-w-2xl w-full ">
					<div className=" shadow-lg ">
						<PostCard
							post={post}
							userData={{
								profileImage: post.userId?.profileImage || '',
								uniqueUsername: post.userId?.uniqueUsername || 'Unknown',
								displayName: post.userId?.displayName || 'Anonymous'
							}}
						/>
					</div>
					<div className="mt-4 max-h-[500px] overflow-y-auto custom-scrollbar">
						<CommentSection
							postId={postId!}
							currentUser={currentUser}
							postAuthorId={post.userId?._id ?? ''}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
