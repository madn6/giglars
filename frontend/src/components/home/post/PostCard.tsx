import '@splidejs/react-splide/css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Post } from '../../../redux/features/posts/postTypes';
import { EllipsisVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReadMoreText from './ReadMoreText';
import {
	LuckButton,
	CapsButton,
	SaveButton,
	ShareButton,
	CommentsButton
} from './interactionButtons';

type PostCardProps = {
	post: Post;
	userData: { profileImage: string; uniqueUsername: string; displayName: string };
	onCommentClick?: (postId: string, postAuthorId: string) => void;
};

export default function PostCard({ post, userData,onCommentClick }: PostCardProps) {
	const removeImagesFromHtml = (html: string) => {
		return html.replace(/<img[^>]*>/g, '');
	};

	const timeAgo = post.createdAt
		? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
		: 'Unknown';

	// Safe media extraction ( image/gif objects might contain 'url')
	const allMedia: string[] = [
		...(post.images?.map((img: { url: string } | string) =>
			typeof img === 'string' ? img : img.url
		) || []),
		...(post.gifs?.map((gif: { url: string } | string) =>
			typeof gif === 'string' ? gif : gif.url
		) || [])
	];

	return (
		<div className="container font-inter bg-secondary shadow-2xl text-white border  border-border/20 p-3 rounded-xl mb-4 backdrop-blur-2xl">
			<div className="top__container flex items-center justify-between gap-4 border border-border/20 p-2 rounded-xl  ">
				<div className="rounded-full flex items-center justify-center border-2  border-white/70">
					<img
						className="w-8 h-8 rounded-full object-cover "
						src={userData.profileImage}
						alt="User profile"
					/>
				</div>
				<div className="flex-1">
					<div className="font-bold">{userData.displayName}</div>
					<div className="text-sm text-gray-text">
						{userData.uniqueUsername} • {timeAgo}
					</div>
				</div>
				{post && (
					<div
						className={`text-xs focus:ring-0 outline-none border font-poppins p-1 px-3 rounded-lg ${
							post.feeling === 'lucky'
								? 'bg-green-500/10 from-green-500/20 to-green-500/5 border-green-500/30 border text-green-200'
								: 'bg-orange-500/10 from-orange-500/20 to-orange-500/5 border-orange-500/30 border text-orange-200'
						}`}
					>
						{post.feeling === 'lucky' ? 'Lucky' : 'Unlucky'}
					</div>
				)}
				<div>
					<EllipsisVertical className="cursor-pointer" />
				</div>
			</div>

			<div className="post-card border border-border/20 p-4 rounded-xl mt-4 bg-secondary text-white shadow-lg">
				{post.tags && (
					<div className="flex flex-wrap gap-2 mb-2 cursor-pointer text-sm">
						{post.tags.map((tag, index) => (
							<span
								key={index}
								className="bg-accent text-black text-xs font-semibold px-2 py-1 rounded-full"
							>
								{tag}
							</span>
						))}
					</div>
				)}
				{/* Text Content */}
				{post.content && (
					<div className="text-base leading-relaxed">
						<ReadMoreText html={removeImagesFromHtml(post.content)} charLimit={150} />
					</div>
				)}

				{/* Media Section */}
				{allMedia.length > 0 && (
					<div className="mt-4  rounded-md">
						{allMedia.length > 1 ? (
							<Splide
								options={{
									type: 'slide',
									perPage: 1,
									pagination: true,
									arrows: true,
									gap: '1rem',
									drag: true,
									speed: 600,
									heightRatio: 0.5625,
									breakpoints: {
										768: {
											arrows: false
										}
									}
								}}
								aria-label="Post media carousel"
								className="rounded-md splide"
							>
								{allMedia.map((src, index) => (
									<SplideSlide key={index}>
										{typeof src === 'string' && src && (
											<img
												src={src}
												alt={`Post media ${index + 1}`}
												onError={(e) => {
													e.currentTarget.src =
														'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png';
												}}
												className="w-full h-full   object-contain rounded-md"
											/>
										)}
									</SplideSlide>
								))}
							</Splide>
						) : (
							<img
								src={allMedia[0]}
								alt="Post Media"
								onError={(e) => {
									e.currentTarget.src =
										'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png';
								}}
								className="w-full h-64 sm:h-80 object-cover rounded-md"
							/>
						)}
					</div>
				)}
			</div>

			<div className="image__bottom flex justify-between items-center mt-4 text-sm">
				<LuckButton postId={post._id ?? ''} />
				<CommentsButton
					onClick={() =>
						onCommentClick?.(
							post._id ?? '',
							post.userId && typeof post.userId === 'object' ? post.userId._id : ''
						)
					}
				/>
				<CapsButton />
				<SaveButton />
				<ShareButton />
			</div>
		</div>
	);
}            
