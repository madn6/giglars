import { LuckiestDay, TrackingStreak, UnluckyEvents, LuckyEvents } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchQuotes } from '../../../redux/features/quote/QuoteSlice';
import { useEffect } from 'react';

export default function WelcomeGreet() {
	const dispatch = useAppDispatch();
	const { text, author, loading } = useAppSelector((state) => state.quote);

	useEffect(() => {
		dispatch(fetchQuotes());
	}, [dispatch]);

	return (
		<>
			<div className="p-12 rounded-xl border-border/20 bg-secondary flex flex-col h-full gap-4 border">
				<div className="">this is welcom component</div>
				<p className="italic text-muted-foreground">
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
