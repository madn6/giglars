import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

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
	// onHide: (commentId: string) => void;
	onReport: (commentId: string, reason?: string) => void;
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
	// onHide,
	onReport,
	comment,
	setOpenMenuId,
	openMenuId,
	setEditingCommentId,
	setEditedContent
}: CommentOperationProps) {
	const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [selectedReason, setSelectedReason] = useState<string | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				openMenuId === comment._id &&
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setOpenMenuId(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [openMenuId, comment._id, setOpenMenuId]);

	return (
		<div className="relative" ref={menuRef}>
			{/* Ellipsis button */}
			<button
				onClick={() => setOpenMenuId((prev) => (prev === comment._id ? null : comment._id))}
				className="text-gray-text text-xl"
			>
				⋯
			</button>

			{/* Dropdown menu */}
			{openMenuId === comment._id && (
				<div className="absolute right-0 mt-1 p-1 w-32 bg-secondary border border-border/20 rounded shadow text-xs z-20">
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
									{/* <button
										onClick={() => {
											onHide(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-yellow-600 hover:bg-gray-100"
									>
										Hide
									</button> */}
									<button
										onClick={() => {
											onDelete(comment._id);
											setOpenMenuId(null);
										}}
										className="block w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100"
									>
										Delete
									</button>
									{/* Anyone except comment author can report */}
								</>
							)}

							{comment.userId._id !== userId && (
								<>
									{reportingCommentId === comment._id ? (
										<div className="relative bg-secondary border border-border/20 text-white rounded shadow p-3 space-y-2">
											{/* Close Button */}

											<button
												onClick={() => {
													setReportingCommentId(null);
													setSelectedReason(null);
												}}
												className="absolute top-1 right-1 z-20  text-red-500 hover:text-red-700 transition-colors duration-200"
											>
												<X size={20} />
											</button>
											<p className="text-sm font-medium text-white mb-1">Reason:</p>

											<div className="space-y-1">
												{['spam', 'abuse', 'other'].map((reason) => (
													<label
														key={reason}
														className="flex items-center space-x-2 cursor-pointer text-sm"
													>
														<input
															type="radio"
															name={`report-${comment._id}`}
															value={reason}
															checked={selectedReason === reason}
															onChange={() => setSelectedReason(reason)}
															className="accent-red-500"
														/>
														<span>{reason.charAt(0).toUpperCase() + reason.slice(1)}</span>
													</label>
												))}
											</div>
												<div className="flex items-center justify-center">
												<button
													disabled={!selectedReason}
													onClick={() => {
														if (selectedReason) {
															onReport(comment._id, selectedReason);
															setReportingCommentId(null);
															setSelectedReason(null);
															setOpenMenuId(null);
														}
													}}
													className=" mt-2 w-full bg-red-600 px-2 py-1 hover:bg-red-700 transition-colors duration-200 text-white rounded  text-sm disabled:opacity-50"
												>
													Report
												</button>
											</div>
										</div>
									) : (
										<button
											onClick={() => setReportingCommentId(comment._id)}
											className="block w-full px-2 py-1 hover:bg-gray text-left"
										>
											Report
										</button>
									)}
								</>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
