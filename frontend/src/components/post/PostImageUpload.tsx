import React from 'react';
import { CircleX, ImageIcon } from 'lucide-react';

type Props = {
	files: File[];
	previews: string[];
	maxImage: number;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (index: number) => void;
};

export default function PostImageUpload({
	files,
	previews,
	maxImage,
	handleFileChange,
	removeImage
}: Props) {
	return (
		<div className="flex items-center flex-wrap gap-3">
			{previews.map((src, index) => (
				<div key={index} className="relative m-2">
					<img src={src} alt="Selected" className="h-7 w-7 md:w-14 md:h-14 object-cover rounded" />
					<CircleX
						onClick={(e) => {
							e.stopPropagation();
							removeImage(index);
						}}
						className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 cursor-pointer"
						size={16}
					/>
				</div>
			))}

			{files.length < maxImage && (
				<label className="flex items-center justify-center p-1 m-2 border border-dashed border-gray-500 rounded cursor-pointer hover:bg-[#0f1f35] transition">
					<div className="flex flex-col items-center text-gray-400">
						<ImageIcon height={20} width={20} />
						<span className="text-xs mt-1 hidden md:block">Add Image</span>
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
