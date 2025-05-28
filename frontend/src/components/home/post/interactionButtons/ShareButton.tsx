import { FaRegShareSquare } from 'react-icons/fa';

type ShareButtonProps = {
  postId: string;
  onClick?: () => void;
};

export default function ShareButton({postId, onClick}: ShareButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <FaRegShareSquare />
      <p>{}</p>
    </div>
  );
}
