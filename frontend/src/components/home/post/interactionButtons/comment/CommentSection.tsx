// components/interactionButtons/comment/CommentSection.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
	createComment,
	deleteComment,
	getComments,
	updateComment
} from '../../../../../redux/features/postInteractions/interactionThunks';

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
	currentUser: {
		userId: string;
		email: string;
		name: string;
		profileImage: string;
		isLoggedIn: boolean;
	};
};

export default function CommentSection({ currentUser, postId }: CommentSectionProps) {
	const dispatch = useAppDispatch();
	const { userId } = useAppSelector((state) => state.auth);

	const [commentText, setCommentText] = useState('');
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [editedContent, setEditedContent] = useState('');
	// const [loading, setLoading] = useState(true);

	const comments = useAppSelector((state) => {
		const post = state.posts.postItems.find((p) => p._id === postId);
		return post?.comments || [];
	});

	useEffect(() => {
		dispatch(getComments(postId));
		// setLoading(false);
	}, [dispatch, postId]);

	const handleSubmit = async () => {
		if (!commentText.trim()) return;
		const res = await dispatch(createComment({ postId, content: commentText }));
		if (createComment.fulfilled.match(res)) {
			setCommentText('');
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
	return (
		<div className="mt-3 rounded-xl border bg-gray border-border/20 p-4 shadow-sm">
			<div className="flex items-center mb-3 gap-2">
				<span className="text-sm">Signed in as:</span>
				<img
					src={currentUser.profileImage}
					className="rounded-full object-cover w-8 h-8"
					alt={currentUser.name}
				/>
				<div className="text-xs text-gray-600">{currentUser.email}</div>
			</div>

			<div className="flex gap-2">
				<input
					type="text"
					className="flex-1 rounded-full border text-gray-text border-gray-300 px-4 py-2 text-sm outline-none"
					placeholder="Write a comment..."
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
				<button
					onClick={handleSubmit}
					className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
				>
					Post
				</button>
			</div>

			<div className="mt-4 space-y-4 max-h-[250px] overflow-y-auto">
				{comments.length === 0 ? (
					<p className="text-gray-400 text-sm">No comments yet.</p>
				) : (
					comments.map((comment) => (
						<div key={comment._id} className="flex items-start gap-3">
							<img
								src={comment.userId.profileImage}
								alt="avatar"
								className="h-8 w-8 rounded-full"
							/>
							<div className="flex-1">
								<div className="flex justify-between items-center">
									<p className="text-sm font-medium">{comment.userId.displayName}</p>
									{comment.userId._id === userId && (
										<div className="flex gap-2 text-xs">
											{editingCommentId === comment._id ? (
												<>
													<button
														onClick={() => handleEditSubmit(comment._id)}
														className="text-green-500 hover:underline"
													>
														Save
													</button>
													<button
														onClick={() => {
															setEditingCommentId(null);
															setEditedContent('');
														}}
														className="text-gray-500 hover:underline"
													>
														Cancel
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => handleEditClick(comment)}
														className="text-blue-500 hover:underline"
													>
														Edit
													</button>
													<button
														onClick={() => handleDelete(comment._id)}
														className="text-red-500 hover:underline"
													>
														Delete
													</button>
												</>
											)}
										</div>
									)}
								</div>

								{editingCommentId === comment._id ? (
									<input
										type="text"
										value={editedContent}
										onChange={(e) => setEditedContent(e.target.value)}
										className="mt-1 w-full border px-2 py-1 text-sm rounded"
									/>
								) : (
									<p className="text-sm text-gray-text">{comment.content}</p>
								)}

								{/* Uncomment to show comment timestamp */}
								{/* <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p> */}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
