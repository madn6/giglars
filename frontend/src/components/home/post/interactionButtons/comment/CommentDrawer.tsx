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
			initial={{ x: '100%' }}
			animate={{ x: 0 }}
			exit={{ x: '100%' }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			className="fixed top-0 left-0 w-full h-full z-[100] bg-secondary dark:bg-background shadow-lg overflow-y-auto"
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
