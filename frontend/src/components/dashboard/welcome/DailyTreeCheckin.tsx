import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import { useMemo, useState } from 'react';
import seedImage from '/images/dashboard-images/seed.png';
import partialYieldImage from '/images/dashboard-images/partial-yield.png';
import saplingImage from '/images/dashboard-images/sapling.png';
import halfTreeImage from '/images/dashboard-images/half-tree.png';
import sproutImage from '/images/dashboard-images/sprout_2.png';
import harvestedImage from '/images/dashboard-images/harvested.png';
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

const getSeasonKey = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const seasonIndex = Math.floor(month / 3);
	const seasonNames = ['Winter', 'Spring', 'Summer', 'Fall'];
	return `${seasonNames[seasonIndex]}-${year}`;
};

const getTreeStage = (days: number) => {
	if (days < 15)
		return {
			image: seedImage,
			label: 'Seed',
			desc: 'Just planted.',
			points: 10
		};
	if (days < 30)
		return {
			image: sproutImage,
			label: 'Sprout',
			desc: 'Small growth.',
			points: 20
		};
	if (days < 45)
		return {
			image: saplingImage,
			label: 'Sapling',
			desc: 'Halfway grown.',
			points: 30
		};
	if (days < 70)
		return {
			image: halfTreeImage,
			label: 'Half-grown Tree',
			desc: 'Almost ready.',
			points: 50
		};
	if (days < 90)
		return {
			image: partialYieldImage,
			label: 'Tree with Fruit',
			desc: 'Partial yield!',
			points: 75
		};

	return {
		image: harvestedImage,
		label: 'Full Harvest',
		desc: 'Full yield! 🏆',
		points: 100
	};
};

const countFullSeasons = (entries: MoodEntry[]) => {
	const seasonMap: Record<string, Set<string>> = {};

	for (const entry of entries) {
		const date = new Date(entry.createdAt);
		const seasonKey = getSeasonKey(date);
		if (!seasonMap[seasonKey]) {
			seasonMap[seasonKey] = new Set();
		}
		seasonMap[seasonKey].add(date.toDateString()); // one entry per day
	}

	// Count how many seasons have 90+ unique days
	let fullSeasons = 0;
	Object.values(seasonMap).forEach((daySet) => {
		if (daySet.size >= 90) {
			fullSeasons++;
		}
	});
	return fullSeasons;
};

export default function DailyTreeCheckin({ entries }: Props) {
	const [showRules, setShowRules] = useState(false);
	const { name: seasonName, startDate, endDate, icon } = getCurrentSeason();

	const checkInCount = useMemo(() => {
		const daySet = new Set(
			entries
				.filter((e) => {
					const day = new Date(e.createdAt);
					return day >= startDate && day <= endDate;
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

	const canParticipate = !firstDay || seasonDay < 75;
	const daysUntilNextSeason = Math.max(0, 90 - seasonDay);

	const dailyPoints = checkInCount * 2;
	const treeStage = getTreeStage(checkInCount);
	const milestonePoints = treeStage.points;

	const totalXP = dailyPoints + milestonePoints;

	const isFullHarvest = checkInCount >= 90;
	const fullSeasonCount = useMemo(() => countFullSeasons(entries), [entries]);

	return (
		<div className="p-4 bg-cyan-500/10 from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 border rounded-md">
			<div className="flex flex-col items-center justify-between space-y-3">
				{/* Header */}
				<div className="w-full text-sm font-medium flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span>{icon}</span>
						{seasonName} Season Progress
						{!showRules && (
							<button onClick={() => setShowRules(true)} className="">
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
					<div className="overflow-y-auto max-h-46 px-1 text-sm flex flex-col gap-3">
						<h3 className="text-center text-base font-semibold">🌳 Seasonal Tree Growth Rules</h3>
						<ul className="list-disc pl-5 text-sm ">
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
				) : canParticipate ? (
					<>
						<div className="flex items-center font-dm-sans gap-2">
							<img
								src={treeStage.image}
								alt={treeStage.label}
								className="w-35 h-35 mt-4 object-contain"
							/>
							<div className="text-center space-y-1">
								<h3 className="text-lg md:text-xl font-semibold text-cyan-200">
									{treeStage.label}
								</h3>
								<p className="text-xs md:text-sm">{treeStage.desc}</p>
								<p className="text-xs font-semibold">
									XP : {dailyPoints} + {milestonePoints} bonus = {totalXP}
								</p>
								{/* Badge for this season */}
								{isFullHarvest && (
									<div className="mt-2 text-sm font-semibold">
										🏅 Badge unlocked: <strong>Full Season Grower</strong>
									</div>
								)}

								{/* Count of past full seasons */}
								{fullSeasonCount > 1 && (
									<div className="text-xs font-medium mt-1">
										🏆 {fullSeasonCount}X Full Season Grower
									</div>
								)}
							</div>
						</div>
						<p className="text-xs font-medium text-green-600">
							{treeStage.label === 'Seed' && '🌱 Great start! Keep nurturing your tree.'}
							{treeStage.label === 'Sprout' && '🌿 Your sprout is reaching for the sun!'}
							{treeStage.label === 'Sapling' && '🌱 You’re halfway there—awesome!'}
							{treeStage.label === 'Half-grown Tree' && '🌳 Almost there! Keep going.'}
							{treeStage.label === 'Tree with Fruit' && '🍎 Your effort is paying off!'}
							{treeStage.label === 'Full Harvest' && '🏆 Incredible! Full season success!'}
						</p>

						{/* ✅ Badge reward for full season */}
						{isFullHarvest && (
							<div className="mt-2 text-sm text-yellow-700 font-semibold">
								🏅 Badge unlocked: <strong>Full Season Grower</strong>
							</div>
						)}
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
