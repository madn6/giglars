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

	stats?: {
		luck: number;
		comments: number;
		caps: number;
		saves: number;
		shares: number;
	};

	userId: {
		profileImage: string;
		uniqueUsername: string;
		displayName: string;
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