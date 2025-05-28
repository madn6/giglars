import { FaRegComment } from 'react-icons/fa';

type CommentsButtonProps = {
  postId: string;
  onClick?: () => void;
};

export default function CommentsButton({postId, onClick}: CommentsButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <FaRegComment />
      <p>{}</p>
    </div>
  );
}