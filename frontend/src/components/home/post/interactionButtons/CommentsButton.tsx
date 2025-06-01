// src/components/CommentsButton.tsx
import { FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type CommentsButtonProps = {
	postId: string;
};

export default function CommentsButton({ postId }: CommentsButtonProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/post/${postId}/comments`);
	};

	return (
		<div
			className="flex items-center gap-2 cursor-pointer hover:opacity-75"
			onClick={handleClick}
		>
			<FaRegComment />
			<p>Comments</p>
		</div>
	);
}

