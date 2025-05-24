import { TrackingStreak, MoodAverage, DailyTreeCheckin } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchQuotes } from '../../../redux/features/quote/QuoteSlice';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';



export default function WelcomeGreet() {
	const dispatch = useAppDispatch();
	const { text, author, loading } = useAppSelector((state) => state.quote);
	const name = useAppSelector((state) => state.auth.name);
	const { entries } = useAppSelector((state) => state.moodEntry);

	useEffect(() => {
		dispatch(fetchQuotes());
		dispatch(fetchMoodEntries());
		// dispatch(sevenDaysEntries());
	}, [dispatch]);


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
				<p className="italic text-gray-text md:text-xl text-md text-center font-light">
					{loading ? 'Loading quote...' : `"${text}" — ${author}`}
				</p>
				{/* Large screens: 3 in a row */}
				<div className="hidden lg:grid grid-cols-3 gap-4">
					<TrackingStreak entries={entries} />
					<MoodAverage entries={entries} />
					<DailyTreeCheckin
					entries={entries} 
					/>
				</div>

				{/* Medium screens: 2 + 1 centered below */}
				<div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
					<TrackingStreak entries={entries} />
					<MoodAverage entries={entries} />
				</div>
				<div className="hidden md:flex lg:hidden justify-center">
					<div className="w-full md:w-1/2 mt-4">
						<DailyTreeCheckin
							entries={entries} 
						/>
					</div>
				</div>

				{/* Small screens: stacked */}
				<div className="md:hidden space-y-4">
					<TrackingStreak entries={entries} />
					<MoodAverage entries={entries} />
					<DailyTreeCheckin  entries={entries} />
				</div>
			</div>
		</>
	);
}
