import { FaRegBookmark } from 'react-icons/fa';

type SaveButtonProps = {
  postId: string;
  onClick?: () => void;
};

export default function SaveButton({postId, onClick}: SaveButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <FaRegBookmark />
      <p>{}</p>
    </div>
  );
}
