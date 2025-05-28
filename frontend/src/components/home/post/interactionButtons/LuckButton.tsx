import { TbClover, TbCloverFilled } from 'react-icons/tb';
import { toggleLuckPost } from '../../../../redux/features/postInteractions/interactionThunks';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';

type LuckButtonProps = {
	postId: string;
};

export default function LuckButton({postId }: LuckButtonProps) {
	const dispatch = useAppDispatch();

	const hasLiked = useAppSelector((state) => state.posts.hasLikedByPost[postId] ?? false);
	const likeCount = useAppSelector((state) => {
		const post = state.posts.postItems.find((p) => p._id === postId);
		return post?.stats?.luck ?? 0;
	});

	const handleClick = () => {
		dispatch(toggleLuckPost(postId));
	};

	return (
		<div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={handleClick}>
			{hasLiked ? <TbCloverFilled size={ 18} /> : <TbClover size={18} />}
			<p>{likeCount}</p>
		</div>
	);
}
