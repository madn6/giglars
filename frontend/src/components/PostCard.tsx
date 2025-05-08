import '@splidejs/react-splide/css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { PiCloverFill } from 'react-icons/pi';
import { GiBilledCap } from 'react-icons/gi';
import { FaRegComment, FaRegBookmark, FaRegShareSquare } from 'react-icons/fa';
import { Post } from '../redux/features/posts/postTypes';
import { EllipsisVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReadMoreText from './post/ReadMoreText';

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

	// Safe media extraction ( image/gif objects might contain 'url')
	const allMedia: string[] = [
		...(post.images?.map((img: { url: string } | string) =>
			typeof img === 'string' ? img : img.url
		) || []),
		...(post.gifs?.map((gif: { url: string } | string) =>
			typeof gif === 'string' ? gif : gif.url
		) || [])
	];

	console.log('📸 allMedia:', allMedia);
	return (
		<div className="container font-inter bg-secondary shadow-2xl text-white border  border-border/20 p-3 rounded-xl backdrop-blur-2xl">
			<div className="top__container flex items-center justify-between gap-4 border border-border/20 p-2 rounded-xl  ">
				<div className="rounded-full flex items-center justify-center border-2 border-border/60">
					<img
						className="w-8 h-8 rounded-full object-cover"
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
				<div>
					<EllipsisVertical className="cursor-pointer" />
				</div>
			</div>

			<div className="post-card border border-border/20 p-4 rounded-xl mt-4 bg-secondary text-white shadow-lg">
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
										<img
											src={src}
											alt={`Post media ${index + 1}`}
											onError={(e) => {
												e.currentTarget.src =
													'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png';
											}}
											className="w-full h-full   object-contain rounded-md"
										/>
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
