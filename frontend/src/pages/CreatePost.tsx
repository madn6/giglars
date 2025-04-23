import PostImageUpload from '../components/post/PostImageUpload';
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

import { Editor } from '@tiptap/react';
import { useRef, useState } from 'react';
import API from '../utils/axios';

export default function CreatePost() {
	const [content, setContent] = useState('');
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky'>('lucky');
	const [postDate, setPostDate] = useState(new Date());
	const [scheduledDate, setScheduledDate] = useState(new Date());
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [visibility, setVisibility] = useState<string>('public');
	const [postGif, setPostGif] = useState<string>('');

	const editorRef = useRef<Editor | null>(null);
	const maxLength = 300;
	const maxImage = 4;


	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
		const totalFiles = [...files, ...selectedFiles].slice(0, maxImage);
		setFiles(totalFiles);
		setPreviews(totalFiles.map((file) => URL.createObjectURL(file)));
	};

	const removeImage = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const handleInsertGif = (gifUrl: string) => {
		setPostGif(gifUrl); // Save for submission
		editorRef.current?.commands.setContent(
			editorRef.current?.getHTML() + `<img src="${gifUrl}" alt="gif" />`
		); // Optional: visually insert in editor
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData();
		const content = editorRef.current?.getHTML() || '';
		formData.append('content', content);
		formData.append('feeling', feeling);
		formData.append('isAnonymous', String(isAnonymous));
		formData.append('postDate', postDate.toISOString());
		formData.append('scheduledDate', scheduledDate.toISOString());
		files.forEach((file) => formData.append('files', file));
		formData.append('tags', JSON.stringify(tags));
		formData.append('visibility', visibility);
		formData.append('gif', postGif);

		console.log('form data:', {
			content,
			feeling,
			isAnonymous,
			postDate,
			scheduledDate,
			files,
			tags,
			visibility,
			postGif
		});
		
		try {
			const res = await API.post('/api/post/create-post', formData, {
				withCredentials:true,
			})
			const data = res.data
			console.log(data)
		} catch (error) {
			console.error('Failed to create post:', error);
		}

	};

	return (
		<div className="min-h-screen flex justify-center items-center pt-10 px-2">
			<div className="w-full max-w-2xl">
				<form onSubmit={handleSubmit} className="rounded-2xl text-white p-4 md:p-6">
					<div className="w-full border border-border rounded-md space-y-6 p-4">
						<PostTextArea
							onEditorReady={(editor) => (editorRef.current = editor)}
							content={content}
							setContent={setContent}
							maxLength={maxLength}
						/>

						<div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
							<PostFeelingSelector feeling={feeling} setFeeling={setFeeling} />
							<PostImageUpload
								files={files}
								previews={previews}
								maxImage={maxImage}
								handleFileChange={handleFileChange}
								removeImage={removeImage}
							/>
						</div>

						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
							<PostDatePicker date={postDate} setDate={setPostDate} />
							<PostTagsInput tags={tags} setTags={setTags} />
							<PostVisibilitySelector visibility={visibility} setVisibility={setVisibility} />
						</div>

						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
							<PostAnonymousToggle
								isAnonymous={isAnonymous}
								handleToggle={(e) => setIsAnonymous(e.target.checked)}
							/>
							<PostGifSelector
								onSelectGif={handleInsertGif}
								setPostGif={setPostGif}
							/>
							<PostScheduleSelector
								scheduledDate={scheduledDate}
								setScheduledDate={setScheduledDate}
							/>
						</div>

						<div className="pt-2">
							<PostSubmitButton />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
