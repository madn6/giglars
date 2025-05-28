import { PiCloverFill } from 'react-icons/pi';
import { useAppDispatch } from '../../../../redux/hooks';
import { toggleLuckPost } from '../../../../redux/features/postInteractions/interactionThunks';

type LuckButtonProps = {
	count: number;
	postId: string;
};

export default function LuckButton({ count, postId, }: LuckButtonProps) {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(toggleLuckPost(postId));
	};

	return (
		<div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={handleClick}>
			<PiCloverFill />
			<p>{count}</p>
		</div>
	);
}
