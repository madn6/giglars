import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import { useMemo } from 'react';
import seedImage from '../../../../public/images/dashboard-images/seeding.png';

// Define the props for the MoodAverage component
type Props = {
	entries: MoodEntry[];
};

const getCurrentSeason = (date = new Date()) => {
	const month = date.getMonth();
	const year = date.getFullYear();
	const index = Math.floor(month / 3);

	const seasons = [
		{ name: 'Winter', start: new Date(year, 0, 1) }, // January 1
		{ name: 'Spring', start: new Date(year, 3, 1) }, // April 1
		{ name: 'Summer', start: new Date(year, 6, 1) }, // July 1
		{ name: 'Fall', start: new Date(year, 9, 1) } // October 1
	];

	const startDate = seasons[index].start; // Get start date of the current season
	const endDate = new Date(startDate); // Copy the start date
	endDate.setMonth(startDate.getMonth() + 3); // Add 3 months to get end of season
	endDate.setDate(startDate.getDate() - 1); // Subtract 1 day to make it inclusive

	return { name: seasons[index].name, startDate, endDate };
};

const getTreeStage = (days: number) => {
	if (days < 15)
		return {
			image: '/frontend/seeding.png',
			label: 'Seed',
			desc: 'Just planted.'
		};
	if (days < 30)
		return {
			image: seedImage,
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
	const { name: seasonName, startDate, endDate } = getCurrentSeason();

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
		<div className="p-4 border border-border/20 rounded-md">
			<div className=" flex flex-col justify-between">
				<div className="text-sm text-muted-foreground mb-2">🌤️ {seasonName} Season Progress</div>

				{canParticipate ? (
					<>
						<div className="flex justify-center">
							<img
								src={treeStage.image}
								alt={treeStage.label}
								className="w-24 h-24 object-contain"
							/>
						</div>
						<div className="text-center font-semibold text-lg mt-2">{treeStage.label}</div>
						<p className="text-xs text-center text-muted-foreground">{treeStage.desc}</p>
						<p className="text-xs text-center mt-2">
							✅ {checkInCount} check-in{checkInCount !== 1 && 's'} this season
						</p>
					</>
				) : (
					<div className="text-center mt-6 space-y-2">
						<div className="text-4xl">🌱</div>
						<p className="text-sm text-muted-foreground">
							The {seasonName.toLowerCase()} season is nearly over!
						</p>
						<p className="text-xs">🌳 A new tree will be ready in {daysUntilNextSeason} days</p>
					</div>
				)}
			</div>
		</div>
	);
}
