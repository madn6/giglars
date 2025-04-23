import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // 👈 Add this
import { useEffect, useState } from 'react';

type Props = {
	content: string;
	setContent: (value: string) => void;
	maxLength: number;
	onEditorReady: (editor: Editor | null) => void;
};

export default function PostTextArea({ content, setContent, maxLength, onEditorReady }: Props) {
	const [charCount, setCharCount] = useState(0);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				inline: true, // 👈 optional: makes image insert inline
				HTMLAttributes: {
					class: 'my-2 rounded-md max-w-full h-auto'
				}
			})
		],
		content,
		onUpdate: ({ editor }) => {
			let text = editor.getText();
			if (text.length > maxLength) {
				text = text.substring(0, maxLength);
				editor.commands.setContent(text);
			}
			setCharCount(text.length);
			setContent(editor.getHTML());
		}
	});

	useEffect(() => {
		if (editor) {
			const text = editor.getText();
			setCharCount(text.length);
			onEditorReady(editor);
		}
	}, [editor, onEditorReady]);

	return (
		<div>
			<EditorContent
				editor={editor}
				className="w-full border border-border rounded-md p-2 bg-transparent outline-none min-h-[100px] max-h-[200px] overflow-y-auto text-white"
			/>
			<p className="text-right text-xs text-gray-400 mt-1">
				{charCount}/{maxLength} characters
			</p>
		</div>
	);
	
}
