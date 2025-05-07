import { PiCloverFill } from 'react-icons/pi';
import { GiBilledCap } from 'react-icons/gi';
import { FaRegComment, FaRegBookmark, FaRegShareSquare } from 'react-icons/fa';
import { Post } from '../redux/features/posts/postTypes';
import { EllipsisVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type PostCardProps = {
	post: Post;
	userData: { profileImage: string; uniqueUsername: string; displayName: string };
};

export default function PostCard({ post, userData }: PostCardProps) {
	const removeImagesFromHtml = (html: string) => {
		return html.replace(/<img[^>]*>/g, '');
	};

	const timeAgo = post.createdAt
		? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
		: 'Unknown';

	return (
		<div className="container font-inter bg-secondary shadow-2xl text-white -z-10 border border-border/20  p-3 rounded-xl backdrop-blur-2xl">
			<div className="top__container flex items-center justify-between gap-4 border border-border/20 p-2 rounded-xl ">
				<div className="rounded-full flex items-center justify-center border-2 border-border/60 ">
					<img className="w-8 h-8 rounded-full object-cover " src={userData.profileImage} alt="" />
				</div>
				<div className="flex-1">
					<div className="font-bold">{userData.displayName}</div>
					<div className="text-sm text-gray-text">
						{userData.uniqueUsername} • {timeAgo}
					</div>
				</div>
				<div className="">
					<EllipsisVertical className="cursor-pointer" />
				</div>
			</div>

			<div className="post-card border border-border/20 p-4 rounded-xl mt-4">
				{/* Text Content (with inline GIFs inside content HTML) */}
				{post.content && (
					<div
						className="mt-3 line-clamp-4"
						dangerouslySetInnerHTML={{ __html: removeImagesFromHtml(post.content) }}
					/>
				)}

				{/* Main Visual */}
				{post.images?.length > 0 ? (
					// Priority: Show main image if it exists
					<div className="mt-3">
						<img
							src={post.images[0]}
							alt="Post Image"
							className="rounded-md w-full max-h-80 object-cover"
						/>
					</div>
				) : post.gifs?.length > 0 ? (
					// Else show first gif
					<div className="mt-3">
						<img
							src={post.gifs[0]}
							alt="Post GIF"
							className="rounded-md w-full max-h-80 object-cover"
						/>
					</div>
				) : null}
			</div>

			<div className="image__bottom flex justify-between items-center mt-4 text-sm">
				<div className="flex items-center gap-2">
					<PiCloverFill />
					<p>{post.stats?.luck}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegComment />
					<p>{post.stats?.comments}</p>
				</div>
				<div className="flex items-center gap-2">
					<GiBilledCap />
					<p>{post.stats?.caps}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegBookmark />
					<p>{post.stats?.saves}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaRegShareSquare />
					<p>{post.stats?.shares}</p>
				</div>
			</div>
		</div>
	);
}
