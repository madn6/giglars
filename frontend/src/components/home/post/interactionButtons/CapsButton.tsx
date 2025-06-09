import { GiBilledCap } from 'react-icons/gi';

// type CapsButtonProps = {
// 	postId: string;
// 	onClick?: () => void;
// };

export default function CapsButton() {
	return (
		<div className="flex items-center gap-2 cursor-pointer hover:opacity-75" >
			<GiBilledCap />
			<p className="">{}</p>
		</div>
	);
}
