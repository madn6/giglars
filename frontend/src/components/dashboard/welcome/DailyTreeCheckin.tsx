import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import { useMemo, useState } from 'react';
import seedImage from '/images/dashboard-images/seeding.png';
import sproutImage from '/images/dashboard-images/sprout.png';
import { Snowflake, Flower, Sun, Leaf } from 'lucide-react';
import { Info } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';

// Define the props for the MoodAverage component
type Props = {
	entries: MoodEntry[];
};

const getCurrentSeason = (date = new Date()) => {
	const month = date.getMonth();
	const year = date.getFullYear();
	const index = Math.floor(month / 3);

	const seasons = [
		{
			name: 'Winter',
			start: new Date(year, 0, 1),
			icon: <Snowflake className="w-5 h-5 text-blue-300" />
		},
		{
			name: 'Spring',
			start: new Date(year, 3, 1),
			icon: <Flower className="w-5 h-5 text-green-400" />
		},
		{
			name: 'Summer',
			start: new Date(year, 6, 1),
			icon: <Sun className="w-5 h-5 text-yellow-400" />
		},
		{
			name: 'Fall',
			start: new Date(year, 9, 1),
			icon: <Leaf className="w-5 h-5 text-orange-400" />
		}
	];
	const selected = seasons[index];
	const startDate = seasons[index].start; // Get start date of the current season
	const endDate = new Date(startDate); // Copy the start date
	endDate.setMonth(startDate.getMonth() + 3); // Add 3 months to get end of season
	endDate.setDate(startDate.getDate() - 1); // Subtract 1 day to make it inclusive

	return { name: seasons[index].name, startDate, endDate, icon: selected.icon };
};

const getTreeStage = (days: number) => {
	if (days < 15)
		return {
			image: seedImage,
			label: 'Seed',
			desc: 'Just planted.'
		};
	if (days < 30)
		return {
			image: sproutImage,
			label: 'Sprout',
			desc: 'Small growth.'
		};
	if (days < 45)
		return {
			image: '/tree-stages/sapling.png',
			label: 'Sapling',
			desc: 'Halfway grown.'
		};
	if (days < 70)
		return {
			image: '/tree-stages/half-tree.png',
			label: 'Half-grown Tree',
			desc: 'Almost ready.'
		};
	if (days < 90)
		return {
			image: '/tree-stages/fruit-tree.png',
			label: 'Tree with Fruit',
			desc: 'Partial yield!'
		};

	return {
		image: '/tree-stages/full-tree.png',
		label: 'Full Harvest',
		desc: 'Full yield! 🏆'
	};
};

export default function DailyTreeCheckin({ entries }: Props) {
	const [showRules, setShowRules] = useState(false);

	const { name: seasonName, startDate, endDate, icon } = getCurrentSeason();

	const checkInCount = useMemo(() => {
		const daySet = new Set(
			entries
				.filter((e) => {
					const day = new Date(e.createdAt);
					return day >= startDate && day <= endDate; //returning a boolean (true or false) to .filter().
				})
				.map((e) => new Date(e.createdAt).toDateString())
		);
		return daySet.size;
	}, [entries, startDate, endDate]);

	const firstEntryInSeason = useMemo(() => {
		const validEntries = entries
			.filter((e) => new Date(e.createdAt) >= startDate && new Date(e.createdAt) <= endDate)
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
		return validEntries[0]?.createdAt;
	}, [entries, startDate, endDate]);

	const seasonDay = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	const firstDay = firstEntryInSeason ? new Date(firstEntryInSeason).getTime() : null;

	const treeStage = getTreeStage(checkInCount);
	const canParticipate = !firstDay || seasonDay < 75;
	const daysUntilNextSeason = Math.max(0, 90 - seasonDay);

	return (
		<div className="p-4 bg-cyan-500/20 border border-cyan-500 rounded-md">
			<div className="flex flex-col items-center justify-between space-y-3">
				{/* Header */}
				<div className="w-full text-sm font-medium flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span>{icon}</span>
						{seasonName} Season Progress
						{!showRules && (
							<button
								onClick={() => setShowRules(true)}
								className="text-muted-foreground hover:text-black"
							>
								<Info size={16} />
							</button>
						)}
					</div>
					<span className="text-sm flex items-center gap-1 ">
						<CircleCheckBig size={14} className="text-green-500" />
						{checkInCount} day{checkInCount !== 1 && 's'}
					</span>
				</div>

				{/* Rules View */}
				{showRules ? (
					<div className="overflow-y-auto max-h-42  px-1 text-sm text-muted-foreground flex flex-col gap-3">
						<h3 className="text-center text-base font-semibold">🌳 Seasonal Tree Growth Rules</h3>
						<ul className="list-disc pl-5 text-gray-textt-xs md:text-sm text-muted-foreground">
							<li>
								<strong>0–14 Days:</strong> Seed — Tree hasn’t sprouted yet.
							</li>
							<li>
								<strong>15–29 Days:</strong> 🌿 Sprout — Early growth begins.
							</li>
							<li>
								<strong>30–44 Days:</strong> 🌱 Sapling — Halfway grown.
							</li>
							<li>
								<strong>45–69 Days:</strong> 🌳 Half-grown Tree — Full height, no fruit.
							</li>
							<li>
								<strong>70–89 Days:</strong> 🌳🍎 Tree with Fruit — Some fruit appears.
							</li>
							<li>
								<strong>90 Days:</strong> 🌳🍇 Full Harvest Tree — Full fruit yield! 🏆
							</li>
							<li className="mt-1">You must start before day 75 of the season to participate.</li>
						</ul>
						<button
							onClick={() => setShowRules(false)}
							className="w-full text-center bg-gray-900 text-white px-3 py-2 rounded-md text-xs"
						>
							Close
						</button>
					</div>
				) : // Main Tree View
				canParticipate ? (
					<>
						<div className="flex items-center font-dm-sans gap-2">
							<img
								src={treeStage.image}
								alt={treeStage.label}
								className="w-35 h-35 mt-4 object-contain"
							/>
							<div className="text-center space-y-1">
								<h3 className="text-lg md:text-xl font-semibold">{treeStage.label}</h3>
								<p className="text-xs md:text-sm">{treeStage.desc}</p>
							</div>
						</div>
					</>
				) : (
					<div className="text-center mt-4 space-y-2">
						<div className="text-3xl">🌱</div>
						<p className="text-sm">The {seasonName.toLowerCase()} season is nearly over!</p>
						<p className="text-xs">
							🌳 A new tree will be ready in <strong>{daysUntilNextSeason} days</strong>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
