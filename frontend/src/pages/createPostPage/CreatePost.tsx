import PostImageUpload from '../../components/createPost/PostImageUpload';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { createPost } from '../../redux/features/posts/postsSlice';
import { CreatePostPayload } from '../../redux/features/posts/postTypes';
import type { AppDispatch } from '../../redux/store/store';

import {
	PostTextArea,
	PostFeelingSelector,
	PostTagsInput,
	PostVisibilitySelector,
	PostGifSelector,
	PostSubmitButton
} from '../../components'

import { Editor } from '@tiptap/react';
import { useRef, useState } from 'react';
import { CircleX } from 'lucide-react';

export default function CreatePost() {
	const [content, setContent] = useState('');
	const [feeling, setFeeling] = useState<'lucky' | 'unlucky'>('lucky');

	const dispatch = useDispatch<AppDispatch>();

	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [visibility, setVisibility] = useState<string>('public');
	const [postGif, setPostGif] = useState<string[]>([]);

	const editorRef = useRef<Editor | null>(null);
	const maxLength = 600;
	const maxImage = 4;
	const maxReached = files.length + postGif.length >= maxImage;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (maxReached) return;

		const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
		const totalSlotsLeft = maxImage - postGif.length - files.length;

		const availableFiles = selectedFiles.slice(0, totalSlotsLeft);
		const updatedFiles = [...files, ...availableFiles];

		setFiles(updatedFiles);
		setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
	};

	const removeImage = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const handleInsertGif = (gifUrl: string) => {
		setPostGif((prev) => [...prev, gifUrl]);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Prepare form data
		const content = editorRef.current?.getHTML() || '';
		const formData: CreatePostPayload = {
			content,
			feeling,
			files,
			tags,
			visibility,
			postGif
		};

		// Dispatch the createPost async thunk
		try {
			dispatch(createPost(formData));
		} catch (error) {
			console.error('Failed to create post:', error);
		}
	};

	function removeGif(index: number) {
		setPostGif((prev) => prev.filter((_, i) => i !== index));
	}

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
								postGif={postGif}
								previews={previews}
								handleFileChange={handleFileChange}
								removeImage={removeImage}
								maxReached={maxReached}
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
									files={files}
									setPostGif={setPostGif}
									postGif={postGif}
									maxReached={maxReached}
								/>
							</motion.div>
						</motion.div>

						{/* GIF Preview Section */}
						<div className="mt-4">
							{postGif.length > 0 && (
								<div className="flex gap-2 items-center justify-center flex-wrap">
									{postGif.map((gifUrl, index) => (
										<div key={gifUrl + index} className="relative">
											<img
												src={gifUrl}
												alt="Selected gif"
												className="h-16 w-16 rounded object-cover"
											/>
											<CircleX
												onClick={(e) => {
													e.stopPropagation();
													removeGif(index);
												}}
												className="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 cursor-pointer"
												size={24}
											/>
										</div>
									))}
								</div>
							)}
						</div>

						<motion.div layout className="pt-2">
							<PostSubmitButton />
						</motion.div>
					</motion.div>
				</form>
			</motion.div>
		</motion.div>
	);
}
