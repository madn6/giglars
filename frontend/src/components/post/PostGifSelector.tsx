import { useEffect, useState } from 'react';
// import { CircleX } from 'lucide-react';
import { Transition } from '@headlessui/react';

type Props = {
	onSelectGif: (gifUrl: string) => void;
	setPostGif: React.Dispatch<React.SetStateAction<string[]>>;
	postGif: string[];
};

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

export default function PostGifSelector({ onSelectGif, setPostGif, postGif }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [gifs, setGifs] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const urls = data.data.map((gif: any) => gif.images.fixed_height.url);
			setGifs(urls);
		} catch (error) {
			console.error('Failed to fetch trending GIFs:', error);
		}
	};

	const fetchSearchGifs = async (query: string) => {
		if (!query) return;
		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
					query
				)}&limit=12`
			);
			const data = await res.json();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const urls = data.data.map((gif: any) => gif.images.fixed_height.url);
			setGifs(urls);
		} catch (error) {
			console.error('Failed to fetch search GIFs:', error);
		}
	};
	const handleGifClick = (gifUrl: string) => {
		setPostGif((prev) => {
			// If already selected 3, block
			if (prev.length >= 3) {
				return prev;
			}

			// If this gif already exists, block
			if (prev.includes(gifUrl)) {
				return prev;
			}

			const updated = [...prev, gifUrl];
			onSelectGif(gifUrl); // Optional: fire only if actually added
			return updated;
		});

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
						onClick={() => {
							if (postGif.length >= 3) return;
							setIsOpen((prev) => !prev);
						}}
						className="p-1 rounded cursor-pointer bg-gray-800 text-white hover:bg-gray-700"
					>
						{isOpen ? 'Close' : 'Open'} GIF Picker
					</button>
				</div>

				<Transition
					appear
					show={isOpen}
					enter="transition-all duration-300 ease-out"
					enterFrom="opacity-0 scale-95 max-h-0"
					enterTo="opacity-100 scale-100 "
					leave="transition-all duration-200 ease-in"
					leaveFrom="opacity-100 scale-100 max-h-[300px]"
					leaveTo="opacity-0 scale-35 max-h-0"
				>
					<div className="mt-2 p-4 border border-border bg-zinc-900 rounded-md overflow-y-auto">
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
								disabled={postGif.length >= 3}
								onClick={handleSearch}
								className="px-3 py-1 cursor-pointer bg-purple-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Search
							</button>
						</div>

						<div className="grid grid-cols-3 gap-2">
							{gifs.map((url, idx) => (
								<img
									key={idx}
									src={url}
									alt="GIF"
									className="cursor-pointer rounded hover:scale-105 transition-transform"
									onClick={() => handleGifClick(url)}
								/>
							))}
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
}
