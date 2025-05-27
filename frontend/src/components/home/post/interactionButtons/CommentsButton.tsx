import { FaRegComment } from 'react-icons/fa';

type CommentsButtonProps = {
    count: number;
  postId: string;
  onClick?: () => void;
};

export default function CommentsButton({count, postId, onClick}: CommentsButtonProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-75" onClick={onClick}>
      <FaRegComment />
      <p>{count}</p>
    </div>
  );
}