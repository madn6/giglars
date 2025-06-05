// components/interactionButtons/comment/CommentSection.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
	createComment,
	deleteComment,
	getComments,
	reportComment,
	updateComment
} from '../../../../../redux/features/postInteractions/interactionThunks';
import CommentOperations from './CommentOperations';
import { toast } from 'react-toastify';
import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type Comment = {
	_id: string;
	content: string;

	userId: {
		_id: string;
		displayName: string;
		profileImage: string;
	};
	createdAt: string;
};

type CommentSectionProps = {
	postId: string;
	postAuthorId: string;
	currentUser: {
		userId: string;
		email: string;
		name: string;
		profileImage: string;
		isLoggedIn: boolean;
	};
};

export default function CommentSection({ currentUser, postId, postAuthorId }: CommentSectionProps) {
	const dispatch = useAppDispatch();
	const { userId } = useAppSelector((state) => state.auth);

	const [commentText, setCommentText] = useState('');
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [editedContent, setEditedContent] = useState('');
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	// const [loading, setLoading] = useState(true);

	const comments = useAppSelector((state) => {
		const post = state.posts.postItems.find((p) => p._id === postId);
		return post?.comments || [];
	});
	console.log('comments', comments);

	useEffect(() => {
		dispatch(getComments(postId));
		// setLoading(false);
	}, [dispatch, postId]);

	const handleSubmit = async () => {
		if (!commentText.trim()) {
			toast.error('comment should be filled');
		}
		const res = await dispatch(createComment({ postId, content: commentText }));
		if (createComment.fulfilled.match(res)) {
			toast.success('comment posted');
			setCommentText('');
			dispatch(getComments(postId)); // Refresh comments after posting
		}
	};

	const handleEditClick = (comment: Comment) => {
		setEditingCommentId(comment._id);
		setEditedContent(comment.content);
	};

	const handleEditSubmit = async (commentId: string) => {
		const res = await dispatch(updateComment({ postId, commentId, content: editedContent }));
		if (updateComment.fulfilled.match(res)) {
			setEditingCommentId(null);
			setEditedContent('');
		}
	};

	const handleDelete = async (commentId: string) => {
		await dispatch(deleteComment({ postId, commentId }));
	};

	const handleReport = (commentId: string, reason?: string) => {
		if (!reason) {
			toast.error('Please provide a reason for reporting.');
			return;
		}
		dispatch(reportComment({ commentId, reason }))
			.unwrap()
			.then((res) => {
				toast.success(res.message || 'Reported successfully');
			})
			.catch((err) => {
				const errorMessage =
					typeof err === 'string' ? err : err?.error || 'Failed to report comment';
				toast.error(errorMessage);
			});
	};

	// const handleHide = (commentId: string) => {
	// 	// Implement hide functionality here
	// 	console.log(`Hiding comment with ID: ${commentId}`);
	// };

	const navigate = useNavigate();


	return (
		<div className=" px-6 shadow-sm">
			<div className="sticky top-0 z-10 bg-primary  p-2">
				<div className="flex items-center justify-between md:gap-8 gap-2  mb-3">
					<button
						onClick={() => navigate('/', { state: { scrollToPostId: postId } })}
						className="flex items-center gap-2 cursor-pointer"
					>
						<MoveLeft size={30} className="text-black bg-accent px-2 py-1 rounded" />
						<span>Back</span>
					</button>

					<div className="flex items-center text-sm gap-2">
						{currentUser.isLoggedIn ? (
							<>
								<span className="">Signed in as:</span>
								<div className="rounded-full flex items-center justify-center">
									<img
										className="w-8 h-8 rounded-full object-cover "
										src={currentUser.profileImage}
										alt={currentUser.name || 'User profile'}
									/>
								</div>
							</>
						) : (
							<>
								<span className="">
									<Link to="/sign-in" className="text-blue-500 hover:underline">
										SignIn
									</Link>
									{' / '}
									<Link to="/sign-up" className="text-blue-500 hover:underline">
										SignUp
									</Link>{' '}
									to comment
								</span>{' '}
							</>
						)}
					</div>
				</div>

				<div className="flex gap-2">
					<input
						type="text"
						className="flex-1 rounded  border-border border px-4 py-2 text-sm outline-none"
						placeholder="Write a comment..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
					/>
					<button
						onClick={handleSubmit}
						disabled={commentText.trim() === ''}
						className={`rounded px-4 py-2 font-medium text-black transition-colors duration-100 ${
							commentText.trim() === ''
								? 'bg-accent/50 cursor-not-allowed opacity-60'
								: 'bg-accent/90 hover:bg-accent'
						}`}
					>
						Post
					</button>
				</div>
			</div>
			<div className="mt-4 space-y-4 ">
				{comments.length === 0 ? (
					<p className="text-gray-400 text-sm">No comments yet.</p>
				) : (
					comments.map((comment) => (
						<div key={comment._id} className="flex items-start gap-3">
							<div className="rounded-full flex items-center  justify-center ">
								<img
									className="w-8 h-8 rounded-full object-cover "
									src={comment.userId.profileImage}
									alt="User profile"
								/>
							</div>
							<div className="flex-1">
								<div className="flex justify-between items-center">
									<p className="text-sm font-medium text-gray-text">{comment.userId.displayName}</p>
									<CommentOperations
										comment={comment}
										postAuthorId={postAuthorId}
										currentUser={currentUser}
										userId={userId ?? ''}
										editingCommentId={editingCommentId}
										setEditingCommentId={setEditingCommentId}
										openMenuId={openMenuId}
										onEditClick={handleEditClick}
										onEditSubmit={handleEditSubmit}
										onDelete={handleDelete}
										onReport={handleReport}
										// onHide={handleHide}
										setOpenMenuId={setOpenMenuId}
									/>
								</div>
								{editingCommentId === comment._id ? (
									<>
										<input
											type="text"
											value={editedContent}
											onChange={(e) => setEditedContent(e.target.value)}
											className="mt-1 w-full border border-border focus:outline-none focus:ring-0 focus:border-transparent px-2 py-2 text-sm rounded"
										/>

										{/* Save & Cancel Buttons Below Input */}
										<div className="mt-2 flex gap-2">
											<button
												onClick={() => handleEditSubmit(comment._id)}
												className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200"
											>
												Save
											</button>
											<button
												onClick={() => {
													setEditingCommentId(null);
													setEditedContent('');
												}}
												className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded transition-colors duration-200"
											>
												Cancel
											</button>
										</div>
									</>
								) : (
									<p className="text-sm">{comment.content}</p>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
