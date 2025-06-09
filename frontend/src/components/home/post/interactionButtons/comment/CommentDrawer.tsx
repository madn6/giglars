// components/interactionButtons/comment/CommentDrawer.tsx
import { motion } from 'framer-motion';
import CommentSection from './CommentSection';

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
	
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}
			className="fixed top-0 left-0 w-full h-full z-[100] bg-secondary dark:bg-background shadow-lg overflow-y-auto rounded-xl custom-scrollbar "
		>
			<CommentSection
				postId={postId}
				postAuthorId={postAuthorId}
				currentUser={currentUser}
				onBack={onClose}
			/>
		</motion.div>
	);
}
