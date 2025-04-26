import PostImageUpload from '../components/post/PostImageUpload';
import { motion } from 'framer-motion';

import {
	PostTextArea,
	PostFeelingSelector,
	PostTagsInput,
	PostVisibilitySelector,
	PostGifSelector,
	PostSubmitButton
} from '../components';

import { Editor } from '@tiptap/react';
import { useRef, useState } from 'react';
import API from '../utils/axios';

export default function CreatePost() {
	const [content, setContent] = useState('');
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky'>('lucky');

	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [visibility, setVisibility] = useState<string>('public');
	const [postGif, setPostGif] = useState<string[]>([]);

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
		setPostGif((prev) => [...prev, gifUrl]);
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

		files.forEach((file) => formData.append('files', file));
		formData.append('tags', JSON.stringify(tags));
		formData.append('visibility', visibility);
		formData.append('gifs', JSON.stringify(postGif));

		console.log('form data:', {
			content,
			feeling,
			files,
			tags,
			visibility,
			postGif
		});

		try {
			const res = await API.post('/api/post/create-post', formData, {
				withCredentials: true
			});
			const data = res.data;
			console.log(data);
		} catch (error) {
			console.error('Failed to create post:', error);
		}
	};

	return (
		<motion.div layout className="h-screen flex justify-center items-center font-inter px-2">
			<motion.div layout className="w-full max-w-2xl">
				<form onSubmit={handleSubmit} className="rounded-2xl text-white p-4 md:p-6">
					<motion.div layout className="w-full border border-border rounded-md space-y-6 p-4">
						<PostTextArea
							onEditorReady={(editor) => (editorRef.current = editor)}
							content={content}
							setContent={setContent}
							maxLength={maxLength}
						/>

						<div>
							<PostImageUpload
								files={files}
								previews={previews}
								maxImage={maxImage}
								handleFileChange={handleFileChange}
								removeImage={removeImage}
							/>
						</div>

						<motion.div
							layout
							className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
						>
							<motion.div layout className="border-border border rounded-md p-3 w-full">
								<PostFeelingSelector feeling={feeling} setFeeling={setFeeling} />
							</motion.div>
							<motion.div layout className="border-border border rounded-md p-3 w-full">
								<PostTagsInput tags={tags} setTags={setTags} />
							</motion.div>
						</motion.div>

						<motion.div
							layout
							className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
						>
							<motion.div layout className="border-border border rounded-md p-3 w-full">
								<PostVisibilitySelector visibility={visibility} setVisibility={setVisibility} />
							</motion.div>
							<motion.div layout className="border-border border rounded-md p-3 w-full">
								<PostGifSelector
									onSelectGif={handleInsertGif}
									setPostGif={setPostGif}
									postGif={postGif}
								/>
							</motion.div>
						</motion.div>

						<motion.div layout className="pt-2">
							<PostSubmitButton />
						</motion.div>
					</motion.div>
				</form>
			</motion.div>
		</motion.div>
	);
}
