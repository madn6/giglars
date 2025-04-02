import { CiMenuKebab } from 'react-icons/ci';
import { PiCloverFill } from 'react-icons/pi';
import { GiBilledCap } from 'react-icons/gi';
import { FaRegComment, FaRegBookmark, FaRegShareSquare } from 'react-icons/fa';

type Post = {
	image: string;
	name: string;
	username: string;
	time: string;
	postText: string;
	postImage?: string; // Optional
	stats: {
		luck: number;
		comments: number;
		caps: number;
		saves: number;
		shares: number;
	};
};

type PostCardProps = {
	post: Post;
};

export default function PostCard({ post }: PostCardProps) {
	return (
		<div className="container text-white -z-10 bg-white/10 border border-white/30 p-4 rounded-xl backdrop-blur-2xl shadow-xl">
			<div className="top__container flex items-center gap-4">
				<img className="w-10 h-10 rounded-full" src={post.image} alt={post.name} />
				<div className="flex-1">
					<div className="font-bold">{post.name}</div>
					<div className="text-sm text-gray-300">
						{post.username} • {post.time}
					</div>
				</div>
				<CiMenuKebab className="cursor-pointer" />
			</div>
			<p className="mt-3 line-clamp-4">{post.postText}</p>

			{post.postImage && (
				<div className="post__image mt-3">
					<img className="w-full rounded-md" src={post.postImage} alt="Post" />
				</div>
			)}

			<div className="image__bottom flex justify-between items-center mt-4 text-sm">
				<div className="flex items-center gap-2">
					<PiCloverFill />
					<p>{post.stats.luck.toLocaleString()}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegComment />
					<p>{post.stats.comments.toLocaleString()}</p>
				</div>
				<div className="flex items-center gap-2">
					<GiBilledCap />
					<p>{post.stats.caps.toLocaleString()}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegBookmark />
					<p>{post.stats.saves.toLocaleString()}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegShareSquare />
					<p>{post.stats.shares.toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
}
