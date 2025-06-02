type CommentOperationProps = {
	comment: {
		_id: string;
		content: string;
		userId: {
			_id: string;
			displayName: string;
			profileImage: string;
		};
		createdAt: string;
	};
	postAuthorId: string;
	currentUser: {
		userId: string;
		email: string;
		name: string;
		profileImage: string;
		isLoggedIn: boolean;
	};
	userId: string;
	openMenuId: string | null;
	editingCommentId?: string | null;

	onEditClick: (comment: CommentOperationProps['comment']) => void;
	onEditSubmit: (commentId: string) => void;
	onDelete: (commentId: string) => void;
	onHide: (commentId: string) => void;
	onReport: (commentId: string) => void;
	setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
	setEditingCommentId?: React.Dispatch<React.SetStateAction<string | null>>;
    setEditedContent?: React.Dispatch<React.SetStateAction<string>>;
};

export default function CommentOperations({
	postAuthorId,
	userId,
	currentUser,
	editingCommentId,
	onDelete,
	onEditClick,
	onEditSubmit,
	onHide,
	onReport,
	comment,
	setOpenMenuId,
    openMenuId,
    setEditingCommentId,
    setEditedContent
}: CommentOperationProps) {
	return (
		<div className="relative">
			{/* Ellipsis button */}
			<button
				onClick={() => setOpenMenuId((prev) => (prev === comment._id ? null : comment._id))}
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
								onClick={() => onEditSubmit(comment._id)}
								className="block w-full px-2 py-1 text-left text-green-600 hover:bg-gray-100"
							>
								Save
							</button>
							<button
								onClick={() => {
                                    setEditingCommentId?.(null);
									setEditedContent?.(''); 
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
											onEditClick(comment);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-blue-600 hover:bg-gray-100"
									>
										Edit
									</button>
									<button
										onClick={() => {
											onDelete(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100"
									>
										Delete
									</button>
								</>
							)}

							{/* Post author moderating others' comments */}
							{comment.userId._id !== userId && currentUser.userId === postAuthorId && (
								<>
									<button
										onClick={() => {
											onHide(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-yellow-600 hover:bg-gray-100"
									>
										Hide
									</button>
									<button
										onClick={() => {
											onDelete(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100"
									>
										Delete
									</button>
									<button
										onClick={() => {
											onReport(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-gray-700 hover:bg-gray-100"
									>
										Report
									</button>
								</>
							)}

							{/* Normal user reporting someone else */}
							{comment.userId._id !== userId && currentUser.userId !== postAuthorId && (
								<button
									onClick={() => {
										onReport(comment._id);
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
	);
}
