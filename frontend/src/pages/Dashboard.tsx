import { EventChart, EventGraph, EventGrid, RecentEvents, TodayEntryForm, WelcomeGreet } from "../components";

export default function Dashborad() {
	return (
		<div className="flex items-center justify-center h-screen text-6xl text-white">
      <WelcomeGreet />
      <EventGrid />
      <EventGraph />
      <EventChart />
      <TodayEntryForm />
      <RecentEvents />
		</div>
	);
}
