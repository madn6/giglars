export interface Post {
	_id?: string;
	profileImage?: string;
	userName?: string;
	email?: string;
	time?: string;

	content?: string;
	images: string[];
	feeling: string;
	tags: string[];
	gifs: string[];
	visibility: string;
	createdAt?: string;
	updatedAt?: string;
	luckBy: string[];

	stats?: {
		luck: number;
		comments: number;
		caps: number;
		saves: number;
		shares: number;
		userHasLiked: boolean;
	};

	userId: {
		profileImage: string;
		uniqueUsername: string;
		displayName: string;
	};

	// NEW: comment support
	comments?: Comment[]; // for storing fetched comments
}

export interface Comment {
	_id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	userId: {
		_id: string;
		email: string;
		displayName: string;
		profileImage: string;
	};
}

export interface CreatePostPayload {
	content: string;
	feeling: string;
	files: File[];
	tags: string[];
	visibility: string;
	postGif: string[];
}
