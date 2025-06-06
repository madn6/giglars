import { useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import CommentDrawer from './comment/CommentDrawer';

type CommentsButtonProps = {
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

export default function CommentsButton({ postId, postAuthorId, currentUser }: CommentsButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div
				className="flex items-center gap-2 cursor-pointer hover:opacity-75"
				onClick={() => setIsOpen(true)}
			>
				<FaRegComment />
				<p>Comments</p>
			</div>

			{isOpen && (
				<CommentDrawer
					postId={postId}
					postAuthorId={postAuthorId}
					currentUser={currentUser}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
