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
	postAuthorId: string;
	currentUser: {
		userId: string;
		email: string;
		name: string;
		profileImage: string;
		isLoggedIn: boolean;
	};
};

export default function CommentSection({ currentUser, postId,postAuthorId }: CommentSectionProps) {
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
									<div className="relative">
										{/* Ellipsis button */}
										<button
											onClick={() =>
												setOpenMenuId((prev) => (prev === comment._id ? null : comment._id))
											}
											className="text-gray-text text-xl"
										>
											⋯
										</button>

										{/* Dropdown menu */}
										{openMenuId === comment._id && (
											<div className="absolute right-0 mt-1 w-32 bg-secondary border border-border/20 rounded shadow text-xs z-20">
												{editingCommentId === comment._id ? (
													<>
														<button
															onClick={() => handleEditSubmit(comment._id)}
															className="block w-full px-2 py-1 text-left text-green-600 hover:bg-gray-100"
														>
															Save
														</button>
														<button
															onClick={() => {
																setEditingCommentId(null);
																setEditedContent('');
																setOpenMenuId(null);
															}}
															className="block w-full px-2 py-1 text-left text-gray-500 hover:bg-gray-100"
														>
															Cancel
														</button>
													</>
												) : (
													<>
														{/* Author of comment */}
														{comment.userId._id === userId && (
															<>
																<button
																	onClick={() => {
																		handleEditClick(comment);
																		setOpenMenuId(null);
																	}}
																	className="block w-full px-2 py-1 text-left text-blue-600 hover:bg-gray-100"
																>
																	Edit
																</button>
																<button
																	onClick={() => {
																		handleDelete(comment._id);
																		setOpenMenuId(null);
																	}}
																	className="block w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100"
																>
																	Delete
																</button>
															</>
														)}

														{/* Post author moderating others' comments */}
														{comment.userId._id !== userId &&
															currentUser.userId === postAuthorId && (
																<>
																	<button
																		onClick={() => {
																			handleHide(comment._id);
																			setOpenMenuId(null);
																		}}
																		className="block w-full px-2 py-1 text-left text-yellow-600 hover:bg-gray-100"
																	>
																		Hide
																	</button>
																	<button
																		onClick={() => {
																			handleDelete(comment._id);
																			setOpenMenuId(null);
																		}}
																		className="block w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100"
																	>
																		Delete
																	</button>
																	<button
																		onClick={() => {
																			handleReport(comment._id);
																			setOpenMenuId(null);
																		}}
																		className="block w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-100"
																	>
																		Report
																	</button>
																</>
															)}

														{/* Normal user reporting someone else */}
														{comment.userId._id !== userId &&
															currentUser.userId !== postAuthorId && (
																<button
																	onClick={() => {
																		handleReport(comment._id);
																		setOpenMenuId(null);
																	}}
																	className="block w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-100"
																>
																	Report
																</button>
															)}
													</>
												)}
											</div>
										)}
									</div>
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
