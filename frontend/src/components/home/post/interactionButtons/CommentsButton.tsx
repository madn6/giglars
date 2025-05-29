import { FaRegComment } from 'react-icons/fa';
import { useState } from 'react';
import CommentSection from '../interactionButtons/comment/CommentSection';
import { useAppSelector } from '../../../../redux/hooks';

type CommentsButtonProps = {
	postId: string;
};

export default function CommentsButton({ postId }: CommentsButtonProps) {
	const [showComments, setShowComments] = useState(false);
	const { profileImage, isLoggedIn, email, name, userId } = useAppSelector((state) => state.auth);

	return (
		<div>
			<div
				className="flex items-center gap-2 cursor-pointer hover:opacity-75"
				onClick={() => setShowComments(!showComments)}
			>
				<FaRegComment />
				<p>Comments</p>
			</div>
			{showComments && (
				<CommentSection
					postId={postId}
					currentUser={{
						userId: userId ?? '',
						email: email ?? '',
						name: name ?? '',
						profileImage: profileImage ?? '',
						isLoggedIn
					}}
				/>
			)}
		</div>
	);
}
