// components/interactionButtons/comment/CommentDrawer.tsx
import { motion } from 'framer-motion';
import CommentSection from './CommentSection';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type CommentDrawerProps = {
	postId: string;
	postAuthorId: string;
	currentUser: {
		userId: string;
		email: string;
		name: string;
		profileImage: string;
		isLoggedIn: boolean;
	};
	onClose: () => void;
};

export default function CommentDrawer({
	postId,
	postAuthorId,
	currentUser,
	onClose
}: CommentDrawerProps) {
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return createPortal(
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}
			className="
    fixed inset-0 z-[200] overflow-y-auto custom-scrollbar  dark:bg-background
    flex justify-center items-center   bg-black/30 backdrop-blur-sm
  "
		>
			<div
				className="
      w-full h-full            
      md:max-w-2xl md:h-[80%]  
      md:mt-10 md:rounded-xl md:shadow-lg
      bg-secondary dark:bg-background overflow-auto custom-scrollbar
    "
			>
				<CommentSection
					postId={postId}
					postAuthorId={postAuthorId}
					currentUser={currentUser}
					onBack={onClose}
				/>
			</div>
		</motion.div>,
		document.body
	);
}
