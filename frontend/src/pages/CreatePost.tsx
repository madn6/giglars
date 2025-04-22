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
	const [postDate, setPostDate] = useState<Date>(new Date());
	const [scheduledDate, setScheduledDate] = useState(new Date());
	const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

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

	const handleToggle = (e:React.ChangeEvent<HTMLInputElement>) => {
		setIsAnonymous(e.target.checked)
		console.log("changed",e.target.checked)
	}


	return (
		<div className="min-h-screen flex justify-center items-center pt-10 px-2">
			<div className="w-full max-w-2xl">
				<form onSubmit={handleSubmit} className="rounded-2xl  text-white p-4 md:p-6">
					<div className="w-full border border-border rounded-md space-y-6 p-4">
						{/* TextArea Section */}
						<div>
							<PostTextArea content={content} setContent={setContent} maxLength={maxLength} />
						</div>

						{/* Feeling Selector + Image Upload */}
						<div className="flex flex-col  md:flex-row md:items-center md:gap-4 gap-2">
							<PostFeelingSelector feeling={feeling} setFeeling={setFeeling} />
							<PostImageUpload
								files={files}
								previews={previews}
								maxImage={maxImage}
								handleFileChange={handleFileChange}
								removeImage={removeImage}
							/>
						</div>

						{/* Date, Tags, Visibility */}
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
							<PostDatePicker date={postDate} setDate={setPostDate} />
							<PostTagsInput />
							<PostVisibilitySelector />
						</div>

						{/* Anonymous, Gif, Schedule */}
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
							<PostAnonymousToggle isAnonymous={isAnonymous} handleToggle ={handleToggle } />
							<PostGifSelector />
							<PostScheduleSelector
								scheduledDate={scheduledDate}
								setScheduledDate={setScheduledDate}
							/>
						</div>

						{/* Submit Button */}
						<div className="pt-2">
							<PostSubmitButton />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
