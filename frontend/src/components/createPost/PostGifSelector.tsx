import { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import { Transition } from '@headlessui/react';

type Props = {
	onSelectGif: (url: string) => void;
	files: File[];
	postGif: string[];
	setPostGif: React.Dispatch<React.SetStateAction<string[]>>;
	maxReached: boolean;
};

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY ?? '';

export default function PostGifSelector({ onSelectGif, setPostGif, postGif, files }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [gifs, setGifs] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	const totalUsedSlots = postGif.length + files.length;
	const maxGifReached = totalUsedSlots >= 4;

	useEffect(() => {
		if (isOpen && gifs.length === 0) {
			fetchTrendingGifs();
		}
	}, [gifs.length, isOpen]);

	const fetchTrendingGifs = async () => {
		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=12`
			);
			const data = await res.json();
			type GifObject = { images: { fixed_height: { url: string } } };
			const urls = data.data.map((gif: GifObject) => gif.images.fixed_height.url);
			setGifs(urls);
		} catch (error) {
			console.error('Failed to fetch trending GIFs:', error);
		}
	};

	const fetchSearchGifs = async (query: string) => {
		if (!query.trim()) return;
		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
					query
				)}&limit=12`
			);
			const data = await res.json();
			const urls = data.data.map((gif: { images: { fixed_height: { url: string } } }) => gif.images.fixed_height.url);
			setGifs(urls);
		} catch (error) {
			console.error('Failed to fetch search GIFs:', error);
		}
	};

	const handleGifClick = (gifUrl: string) => {
		if (maxGifReached || postGif.includes(gifUrl)) return;
		onSelectGif(gifUrl);
		setIsOpen(false);
	};

	const handleSearch = () => {
		fetchSearchGifs(searchQuery);
	};

	return (
		<div className="text-xs flex items-center justify-center text-gray-400">
			<div className="flex flex-col items-center justify-center">
				<div className="flex items-center gap-2">
					<span>Add GIF:</span>
					<button
						type="button"
						disabled={maxGifReached}
						onClick={() => setIsOpen((prev) => !prev)}
						className="p-1 rounded cursor-pointer bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isOpen ? 'Close' : 'Open'} GIF Picker
					</button>
				</div>

				<Transition
					appear
					show={isOpen}
					enter="transition-all duration-300 ease-out"
					enterFrom="opacity-0 scale-95 max-h-0"
					enterTo="opacity-100 scale-100"
					leave="transition-all duration-200 ease-in"
					leaveFrom="opacity-100 scale-100 max-h-[300px]"
					leaveTo="opacity-0 scale-35 max-h-0"
				>
					<div className="mt-2 p-4 border border-border bg-zinc-900 rounded-md overflow-y-auto max-h-[300px] w-80">
						<div className="mb-3 flex gap-2">
							<input
								type="text"
								placeholder="Search GIFs..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleSearch();
									}
								}}
								className="flex-1 px-3 py-1 rounded bg-gray-800 text-white placeholder-gray-400"
							/>
							<button
								type="button"
								disabled={maxGifReached}
								onClick={handleSearch}
								className="px-3 py-1 cursor-pointer bg-purple-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Search
							</button>
						</div>

						<div className="grid grid-cols-3 gap-2">
							{gifs.map((gifUrl, index) => (
								<img
									key={gifUrl + index}
									src={gifUrl}
									alt="gif"
									onClick={() => handleGifClick(gifUrl)}
									className={`h-20 w-full object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-200 ${
										postGif.includes(gifUrl) ? 'opacity-50 pointer-events-none' : ''
									}`}
								/>
							))}
						</div>

						<div className="mt-3 grid grid-cols-3 gap-2">
							{postGif.map((gifUrl, index) => (
								<div key={gifUrl + index} className="relative">
									<img
										src={gifUrl}
										alt="Selected gif"
										className="h-16 w-full rounded object-cover"
									/>
									<CircleX
										onClick={() => {
											setPostGif((prev) => prev.filter((_, i) => i !== index));
										}}
										className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 cursor-pointer"
										size={20}
									/>
								</div>
							))}
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
}
