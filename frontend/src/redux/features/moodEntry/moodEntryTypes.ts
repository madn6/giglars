export type MoodEntry = {
	_id: string;
	type: 'lucky' | 'unlucky' | 'neutral';
	description: string;
	intensity: number;
	createdAt: string;
};
