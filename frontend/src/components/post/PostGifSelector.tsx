import { useEffect, useState } from 'react';

type Props = {
	onSelectGif: (gifUrl: string) => void;
	setPostGif: React.Dispatch<React.SetStateAction<string>>;
};

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

export default function PostGifSelector({ onSelectGif, setPostGif }: Props) {
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
		onSelectGif(gifUrl);
		setPostGif(gifUrl);
		setIsOpen(false);
	};

	const handleSearch = () => {
		fetchSearchGifs(searchQuery);
	};

	return (
		<div className="text-xs text-gray-400">
			<div className="flex items-center gap-2">
				<span>Add GIF:</span>
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					className="p-1 rounded cursor-pointer bg-gray-800 text-white hover:bg-gray-700"
				>
					{isOpen ? 'Close' : 'Open'} GIF Picker
				</button>
			</div>

			{isOpen && (
				<div className="mt-2 p-4 border border-border bg-zinc-900 rounded-md max-h-[300px] overflow-y-auto">
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
							onClick={handleSearch}
							className="px-3 py-1 bg-purple-600 text-white rounded"
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
			)}
		</div>
	);
}
