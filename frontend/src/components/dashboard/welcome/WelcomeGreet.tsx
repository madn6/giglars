import { LuckiestDay, TrackingStreak, UnluckyEvents, LuckyEvents } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchQuotes } from '../../../redux/features/quote/QuoteSlice';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function WelcomeGreet() {
	const dispatch = useAppDispatch();
	const { text, author, loading } = useAppSelector((state) => state.quote);
	const name = useAppSelector((state) => state.auth.name);

	useEffect(() => {
		dispatch(fetchQuotes());
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
						<Sparkles className='text-amber-400' size={30}/>
					</div>
					<div className="md:text-4xl text-2xl font-dm-sans font-semibold text-white">
						{timeGreeting}, <span className="text-accent">{name || 'friend'}</span>
						<span className="text-accent">!</span> {message}
					</div>
				</div>
				<p className="italic text-gray-text md:text-xl text-lg text-muted-foreground text-center font-light">
					{loading ? 'Loading quote...' : `"${text}" — ${author}`}
				</p>
				<div
					className="
                                grid 
								grid-cols-1 
									md:grid-cols-2 
									lg:grid-cols-4 
									gap-4
									"
				>
					<LuckyEvents />
					<UnluckyEvents />
					<TrackingStreak />
					<LuckiestDay />
				</div>
			</div>
		</>
	);
}
