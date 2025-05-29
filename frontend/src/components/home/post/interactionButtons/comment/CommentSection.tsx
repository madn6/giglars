// components/interactionButtons/comment/CommentSection.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
	createComment,
	deleteComment,
	getComments
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
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadComments = async () => {
			setLoading(true);
			const response = await dispatch(getComments(postId));
			if (getComments.fulfilled.match(response)) {
				setComments(response.payload);
			}
			setLoading(false);
		};

		loadComments();
	}, [dispatch, postId]);

	const handleSubmit = async () => {
		if (!commentText.trim()) return;
		const res = await dispatch(createComment({ postId, content: commentText }));
		if (createComment.fulfilled.match(res)) {
			setComments((prev) => [...prev, res.payload]);
			setCommentText('');
		}
	};

	const handleDelete = async (commentId: string) => {
		const res = await dispatch(deleteComment({ postId, commentId }));
		if (deleteComment.fulfilled.match(res)) {
			setComments((prev) => prev.filter((c) => c._id !== commentId));
		}
	};

	return (
		<div className="mt-3 rounded-xl border bg-gray border-border/20 p-4 shadow-sm">
			<div className="flex items-center mb-3 gap-1">
				<div className="">signedIn as : </div>
				<div className="">
					<img
						src={currentUser.profileImage}
						className="rounded-full object-cover w-8 h-8"
						alt={currentUser.name}
					/>
				</div>
				<div className="">
					<div className="text-xs">{currentUser.email}</div>
				</div>
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
				{loading ? (
					<p className="text-gray-500 text-sm">Loading comments...</p>
				) : comments.length === 0 ? (
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
								<div className="flex justify-between">
									<p className="text-sm font-medium">{comment.userId.displayName}</p>
									{comment.userId._id === userId && (
										<button
											onClick={() => handleDelete(comment._id)}
											className="text-xs text-red-500 hover:underline"
										>
											Delete
										</button>
									)}
								</div>
								<p className="text-sm text-gray-700">{comment.content}</p>
								<p className="text-xs text-gray-400">
									{new Date(comment.createdAt).toLocaleString()}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
