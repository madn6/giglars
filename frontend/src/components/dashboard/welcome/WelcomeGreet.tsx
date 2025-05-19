import { TrackingStreak, MoodAverage, DailyQuiz, PredictionTracker } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchQuotes } from '../../../redux/features/quote/QuoteSlice';
import { useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';
import { sevenDaysEntries } from '../../../redux/features/moodEntry/moodEntrySlice';

//calculate avearage streak
function calculateStreak(entries: MoodEntry[]) {
	if (!entries.length) return 0;

	const daysSet = new Set(entries.map((e) => new Date(e.createdAt).toDateString()));

	let streak = 0;
	const current = new Date();

	while (daysSet.has(current.toDateString())) {
		streak++;
		current.setDate(current.getDate() - 1);
	}

	return streak;
}

//calculate average mood
function calculateAverageMood(entries: MoodEntry[]): number {
	if (!entries.length) return 0;

	const validIntensities = entries
		.filter((e) => typeof e.intensity === 'number')
		.map((e) => e.intensity);

	if (!validIntensities.length) return 0;

	const sum = validIntensities.reduce((acc, curr) => acc + curr, 0);
	return sum / validIntensities.length;
}

//quizz points
function getQuizPoints(entries: MoodEntry[]): number {
	return entries.reduce((total, e) => total + (e.quizPoints || 0), 0);
}

//prediction center
function getPredictionStats(entries: MoodEntry[]) {
	let correct = 0;
	let incorrect = 0;
	let streak = 0;

	// Loop for streak and count corrects until first incorrect
	for (let i = entries.length - 1; i >= 0; i--) {
		const e = entries[i];
		if (e.predictionCorrect === true) {
			correct++;
			streak++;
		} else if (e.predictionCorrect === false) {
			incorrect++;
			break; // streak ends at first incorrect
		}
	}

	// Count remaining incorrects
	for (let j = entries.length - 1; j >= 0; j--) {
		const e = entries[j];
		if (e.predictionCorrect === false) incorrect++;
	}

	return { correct, incorrect, streak };
}

export default function WelcomeGreet() {
	const dispatch = useAppDispatch();
	const { text, author, loading } = useAppSelector((state) => state.quote);
	const name = useAppSelector((state) => state.auth.name);
	const { entries } = useAppSelector((state) => state.moodEntry);
	const sevenDayEntries = useAppSelector((state) => state.moodEntry.sevenDayEntries);

	console.log(sevenDayEntries)

	useEffect(() => {
		dispatch(fetchQuotes());
		dispatch(fetchMoodEntries());
		dispatch(sevenDaysEntries());
	}, [dispatch]);

	const stats = useMemo(() => {
		const streak = calculateStreak(entries);
		const avgMood = calculateAverageMood(sevenDayEntries);
		const quizPoints = getQuizPoints(entries);
		const { correct, incorrect, streak: predictionStreak } = getPredictionStats(entries);

		return {
			streak,
			avgMood,
			quizPoints,
			correctPredictions: correct,
			incorrectPredictions: incorrect,
			predictionStreak
		};
	}, [entries, sevenDayEntries]);

	console.log('Stats:', stats);

	const getGreetingParts = () => {
		const hour = new Date().getHours();

		if (hour < 12) {
			return ['Good morning', 'Ready to own the day?'];
		}
		if (hour < 18) {
			return ['Good afternoon', 'Keep the momentum going'];
		}
		if (hour < 22) {
			return ['Good evening', 'You’ve made it this far be proud'];
		}
		return ['Good night', 'Time to recharge sweet dreams'];
	};

	const [timeGreeting, message] = getGreetingParts();

	return (
		<>
			<div className="p-4 md:p-6 rounded-xl border-border/20 bg-secondary flex flex-col h-full gap-4 border">
				<div className="flex items-center text-center justify-center gap-2">
					<div className="">
						<Sparkles className="text-amber-400 hidden lg:block" size={30} />
					</div>
					<div className="md:text-4xl text-2xl font-dm-sans font-semibold text-white">
						{timeGreeting}, <span className="text-accent">{name || 'friend'}</span>
						<span className="text-accent">!</span> {message}
					</div>
				</div>
				<p className="italic text-gray-text md:text-xl text-md text-muted-foreground text-center font-light">
					{loading ? 'Loading quote...' : `"${text}" — ${author}`}
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<TrackingStreak streak={stats.streak} />
					<MoodAverage moodScore={stats.avgMood} />
					<DailyQuiz points={stats.quizPoints} />
					<PredictionTracker
						correct={stats.correctPredictions}
						incorrect={stats.incorrectPredictions}
						streak={stats.predictionStreak}
					/>
				</div>
			</div>
		</>
	);
}
