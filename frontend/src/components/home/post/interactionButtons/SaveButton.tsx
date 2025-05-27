import { FaRegBookmark } from 'react-icons/fa';

type SaveButtonProps = {
    count: number;
  postId: string;
  onClick?: () => void;
};

export default function SaveButton({count, postId, onClick}: SaveButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <FaRegBookmark />
      <p>{count}</p>
    </div>
  );
}
