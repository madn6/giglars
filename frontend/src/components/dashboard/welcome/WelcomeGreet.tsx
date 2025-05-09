import { LuckiestDay, TrackingStreak, UnluckyEvents, LuckyEvents } from '../../index';
type Props = {};

export default function WelcomeGreet({}: Props) {
	return (
		<>
			<div className="p-12 rounded-md border-border flex flex-col gap-4 border">
				<div className="">this is welcom component</div>
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
