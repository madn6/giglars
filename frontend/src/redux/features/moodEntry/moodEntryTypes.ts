export interface MoodEntry {
	_id: string;
	description: string;
	type: string;
	intensity: number;
	createdAt: string;
	updatedAt: string;
	quizPoints?: number;
	prediction?: string;
	predictionCorrect?: boolean;
}
