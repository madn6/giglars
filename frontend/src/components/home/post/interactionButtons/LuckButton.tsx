import { PiCloverFill } from 'react-icons/pi';

type LuckButtonProps = {
    count: number;
  postId: string;
  onClick?: () => void;
};

export default function LuckButton({count, postId, onClick}: LuckButtonProps) {
	return (
		<div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
			<PiCloverFill />
			<p>{count}</p>
		</div>
	);
}
