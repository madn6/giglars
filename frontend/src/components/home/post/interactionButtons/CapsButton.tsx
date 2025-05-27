import { GiBilledCap } from 'react-icons/gi';

type CapsButtonProps = {
    count: number;
  postId: string;
  onClick?: () => void;
};

export default function CapsButton({count, postId, onClick}: CapsButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <GiBilledCap />
      <p>{count}</p>
    </div>
  );
}
