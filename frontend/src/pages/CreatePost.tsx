import { useState } from 'react';
import {
	PostTextArea,
	PostFeelingSelector,
	PostDatePicker,
	PostTagsInput,
	PostVisibilitySelector,
	PostAnonymousToggle,
	PostGifSelector,
	PostScheduleSelector,
	PostSubmitButton
} from '../components';
import PostImageUpload from '../components/post/PostImageUpload';

export default function CreatePost() {
	const [content, setContent] = useState('');
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky'>('lucky');
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const maxLength = 300;
	const maxImage = 4;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ content, feeling, files });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files ? Array.from(e.target.files) : [];
		const totalFiles = [...files, ...selectedFile].slice(0, maxImage);
		setFiles(totalFiles);
		setPreviews(totalFiles.map((file) => URL.createObjectURL(file)));
	};

	const removeImage = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		const updatedPreviews = previews.filter((_, i) => i !== index);
		setFiles(updatedFiles);
		setPreviews(updatedPreviews);
	};

	return (
		<div className="min-h-screen flex justify-center items-center pt-10 px-4">
			<div className="w-full max-w-xl">
				<form onSubmit={handleSubmit} className="rounded-2xl shadow text-white">
					<div className="w-full p-3 border border-border rounded-md space-y-4">
						{/* TextArea Section */}
						<div>
							<PostTextArea content={content} setContent={setContent} maxLength={maxLength} />
						</div>

						{/* Feeling Selector */}
						<PostFeelingSelector feeling={feeling} setFeeling={setFeeling} />

						{/* Image Previews & Upload */}
						<PostImageUpload
							files={files}
							previews={previews}
							maxImage={maxImage}
							handleFileChange={handleFileChange}
							removeImage={removeImage}
						/>

						{/* Event Date Picker */}
						<PostDatePicker />

						{/* Tags Input */}
						<PostTagsInput />

						{/* Post Visibility */}
						<PostVisibilitySelector />

						{/* Anonymous Toggle */}
						<PostAnonymousToggle />

						{/* GIF Upload Placeholder */}
						<PostGifSelector />

						{/* Schedule Post */}
						<PostScheduleSelector />

						{/* Submit Button */}
						<PostSubmitButton />
					</div>
				</form>
			</div>
		</div>
	);
}
