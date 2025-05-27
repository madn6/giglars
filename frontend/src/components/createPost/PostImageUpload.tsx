import React from 'react';
import { CircleX, ImageIcon } from 'lucide-react';

type Props = {
	files: File[];
	previews: string[];
	postGif: string[];
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (index: number) => void;
	maxReached: boolean;
};


export default function PostImageUpload({
	files,
	previews,
	postGif,
	handleFileChange,
	removeImage
}: Props) {
	const totalUsedSlots = files.length + postGif.length;
	const maxReached = totalUsedSlots >= 4;

	return (
		<div className="flex items-center flex-wrap gap-3 w-full justify-center">
			{previews.map((src, index) => (
				<div key={index} className="relative m-1">
					<img
						src={src}
						alt="Selected"
						className="h-16 w-16 md:w-14 md:h-14 object-cover rounded"
					/>
					<CircleX
						onClick={(e) => {
							e.stopPropagation();
							removeImage(index);
						}}
						className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 cursor-pointer"
						size={24}
					/>
				</div>
			))}

			{/* Show uploader only if max not reached */}
			{!maxReached && (
				<label className="flex py-2 items-center w-full justify-center p-1 m-2 border border-dashed border-gray-500 rounded cursor-pointer hover:bg-[#0f1f35] transition">
					<div className="flex flex-col items-center text-gray-400">
						<ImageIcon />
						<span className="text-xs mt-1">Add Image</span>
					</div>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						multiple
						className="hidden"
					/>
				</label>
			)}
		</div>
	);
}
