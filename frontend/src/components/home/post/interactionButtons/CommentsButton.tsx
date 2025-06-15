import { FaRegComment } from 'react-icons/fa';

type CommentsButtonProps = {
	onClick?: () => void;
};

export default function CommentsButton({ onClick }: CommentsButtonProps) {
	return (
		<>
			<div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
				<FaRegComment />
				<p>Comments</p>
			</div>
		</>
	);
}
