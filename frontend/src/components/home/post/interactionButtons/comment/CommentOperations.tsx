import { useEffect, useRef, useState } from 'react';
import { Ellipsis, Flag, Pencil, Trash2 } from 'lucide-react';

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
	onDelete,
	onEditClick,
	// onHide,
	onReport,
	comment,
	setOpenMenuId,
	openMenuId
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
				className="text-gray-text"
			>
				<Ellipsis size={24}/>
			</button>

			{/* Dropdown menu */}
			{openMenuId === comment._id && (
				<div className="absolute right-0 mt-1 p-1 w-32 bg-secondary border text-gray-text border-border/20 rounded shadow text-sm z-20">
					<>
						{/* Author of comment */}
						{comment.userId._id === userId && (
							<>
								<button
									onClick={() => {
										onEditClick(comment);
										setOpenMenuId(null);
									}}
									className="block w-full rounded px-2 py-1 text-left hover:bg-gray hover:text-blue-500 transition-colors duration-200"
								>
									<div className="flex items-center justify-start gap-2">
										<Pencil size={14} className="" />
										<div className="">Edit</div>
									</div>
								</button>
								<button
									onClick={() => {
										onDelete(comment._id);
										setOpenMenuId(null);
									}}
									className="block w-full rounded px-2 py-1 text-left hover:bg-gray hover:text-red-500 transition-colors duration-200"
								>
									<div className="flex items-center justify-start gap-2">
										<Trash2 size={14} className="" />
										<div className="">Delete</div>
									</div>
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
									className="block w-full px-2 py-1 text-left hover:bg-gray hover:text-red-500 transition-colors duration-200"
								>
									<div className="flex items-center justify-start gap-2">
										<Trash2 size={14} className="" />
										<div className="">Delete</div>
									</div>
								</button>
							</>
						)}

						{comment.userId._id !== userId && (
							<>
								{reportingCommentId === comment._id ? (
									<div className="relative bg-secondary my-1 w-full border border-border/20 text-white rounded shadow p-3 space-y-2">
										{/* Close Button */}

										<button
											onClick={() => {
												setReportingCommentId(null);
												setSelectedReason(null);
											}}
											className="absolute top-2 right-2 z-20  text-red-500 hover:text-red-700 transition-colors duration-200"
										>
											<X size={18} />
										</button>
										<p className=" font-medium mb-1 text-gray-text">Reason:</p>

										<div className="space-y-1">
											{['spam', 'abuse', 'other'].map((reason) => (
												<label
													key={reason}
													className="flex items-center text-gray-text space-x-2 cursor-pointer "
												>
													<input
														type="radio"
														name={`report-${comment._id}`}
														value={reason}
														checked={selectedReason === reason}
														onChange={() => setSelectedReason(reason)}
														className="accent-orange-500"
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
												className=" mt-2 w-full bg-orange-500 px-2 py-1 hover:bg-orange-600 transition-colors duration-200 text-white rounded   disabled:opacity-50"
											>
												Report
											</button>
										</div>
									</div>
								) : (
									<button
										onClick={() => setReportingCommentId(comment._id)}
										className="block w-full rounded px-2 py-1 hover:bg-gray text-left hover:text-orange-500 transition-colors duration-200"
									>
										<div className="flex items-center justify-start gap-2">
											<Flag size={14} />
											<div className="">Report</div>
										</div>
									</button>
								)}
							</>
						)}
					</>
				</div>
			)}
		</div>
	);
}
