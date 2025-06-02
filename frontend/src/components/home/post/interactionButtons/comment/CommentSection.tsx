// components/interactionButtons/comment/CommentSection.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
	createComment,
	deleteComment,
	getComments,
	updateComment
} from '../../../../../redux/features/postInteractions/interactionThunks';
import CommentOperations from './CommentOperations';

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
		if (!commentText.trim()) return;
		const res = await dispatch(createComment({ postId, content: commentText }));
		if (createComment.fulfilled.match(res)) {
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

	const handleReport = (commentId: string) => {
		console.log(`Reporting comment with ID: ${commentId}`);
	};

	const handleHide = (commentId: string) => {
		// Implement hide functionality here
		console.log(`Hiding comment with ID: ${commentId}`);
	};
	return (
		<div className=" px-2 shadow-sm">
			<div className="sticky top-0 z-10 bg-primary  p-2">
				<div className="flex items-center mb-3 gap-2">
					<span className="text-sm">Signed in as:</span>
					<div className="rounded-full flex items-center justify-center">
						<img
							className="w-8 h-8 rounded-full object-cover "
							src={currentUser.profileImage}
							alt={currentUser.name || 'User profile'}
						/>
					</div>
					<div className="text-xs">{currentUser.email}</div>
				</div>

				<div className="flex gap-2">
					<input
						type="text"
						className="flex-1 rounded-full  border-border/20 border px-4 py-2 text-sm outline-none"
						placeholder="Write a comment..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
					/>
					<button
						onClick={handleSubmit}
						className="rounded-full bg-accent/90 px-4 py-2  font-medium text-black transition-colors duration-100 hover:bg-accent"
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
										onHide={handleHide}
										setOpenMenuId={setOpenMenuId}
									/>
								</div>
								{editingCommentId === comment._id ? (
									<input
										type="text"
										value={editedContent}
										onChange={(e) => setEditedContent(e.target.value)}
										className="mt-1 w-full border px-2 py-1 text-sm rounded"
									/>
								) : (
									<p className="text-sm ">{comment.content}</p>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
