import {
	EventChart,
	EventGraph,
	EventGrid,
	RecentEvents,
	TodayEntryForm,
	WelcomeGreet
} from '../components';

export default function Dashboard() {
	return (
		<div className="h-full mt-20 text-white max-w-7xl mx-auto p-4">
			<div
				className="
					grid
					grid-cols-1
					md:grid-cols-2
					lg:grid-cols-4
					auto-rows-auto
					gap-6
				"
			>
				{/* WelcomeGreet - full width */}
				<div className="col-span-1 md:col-span-2 lg:col-span-4">
					<WelcomeGreet />
				</div>

				{/* EventGrid - left side on large screen */}
				<div className="col-span-1 md:col-span-2 lg:col-span-2">
					<EventGrid />
				</div>

				{/* TodayEntryForm - right side on large screen */}
				<div className="col-span-1 md:col-span-2 lg:col-span-2">
					<TodayEntryForm />
				</div>

				{/* RecentEvents - full width */}
				<div className="col-span-1 md:col-span-2 lg:col-span-4">
					<RecentEvents />
				</div>

				{/* Graph and Chart - side by side on lg */}
				<div className="col-span-1 md:col-span-1 lg:col-span-2">
					<EventGraph />
				</div>
				<div className="col-span-1 md:col-span-1 lg:col-span-2">
					<EventChart />
				</div>
			</div>
		</div>
	);
}
