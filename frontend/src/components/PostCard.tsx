// import { CiMenuKebab } from 'react-icons/ci';
import { PiCloverFill } from 'react-icons/pi';
import { GiBilledCap } from 'react-icons/gi';
import { FaRegComment, FaRegBookmark, FaRegShareSquare } from 'react-icons/fa';
import { Post } from '../redux/features/posts/postsSlice';

type PostCardProps = {
	post: Post;
};

export default function PostCard({ post }: PostCardProps) {
	return (
		<div className="container font-inter shadow-2xl text-white -z-10 bg-transparent border border-border p-4 rounded-xl backdrop-blur-2xl">
			{/* <div className="top__container flex items-center gap-4">
				<img className="w-10 h-10 rounded-full" src={profileImage} alt={userName} />
				<div className="flex-1">
					<div className="font-bold">{userName}</div>
					<div className="text-sm text-gray">
						@{userName} • {time}
					</div>
				</div>
				<CiMenuKebab className="cursor-pointer" />
			</div> */}

			<div className="post-card">
				{/* Text Content (with inline GIFs inside content HTML) */}
				<div className="mt-3 line-clamp-4" dangerouslySetInnerHTML={{ __html: post.content }} />

				{/* Main Visual */}
				{post.images.length > 0 ? (
					// Priority: Show main image if it exists
					<div className="mt-3">
						<img
							src={post.images[0]}
							alt="Post Image"
							className="rounded-md w-full max-h-80 object-cover"
						/>
					</div>
				) : post.gifs.length > 0 ? (
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
