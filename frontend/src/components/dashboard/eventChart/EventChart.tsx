import { Pie } from 'react-chartjs-2';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);


type Props = {
	entries: MoodEntry[];
};

const COLORS = ['#22c55e', '#f97316', '#3b82f6']; // lucky, unlucky, neutral

export default function EventChart({ entries }: Props) {
	const countByType = entries.reduce(
		(acc, entry) => {
			acc[entry.type as 'lucky' | 'unlucky' | 'neutral'] += 1;
			return acc;
		},
		{ lucky: 0, unlucky: 0, neutral: 0 } as Record<'lucky' | 'unlucky' | 'neutral', number>
	);

	const total = entries.length;
	const luckyPercentage = total === 0 ? 0 : Math.round((countByType.lucky / total) * 100);

	const data = {
		labels: ['Lucky', 'Unlucky', 'Neutral'],
		datasets: [
			{
				data: [countByType.lucky, countByType.unlucky, countByType.neutral],
				backgroundColor: COLORS,
				borderWidth: 1
			}
		]
	};

	const options = {
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					color: '#ffffff'
				}
			},
			tooltip: {
				enabled: true
			},
			datalabels: {
				color: '#fff',
				font: {
					weight: 'bold' as const,
					size: 16,
					family:'font-poppins'
					
				},
				formatter: (value: number) => {
					const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
					const percentage = total === 0 ? 0 : (value / total) * 100;
					return `${percentage.toFixed(1)}%`;
				}
			}
		},
		maintainAspectRatio: false
	};

	return (
		<div className="lg:p-6 p-4  rounded-xl bg-secondary h-full border border-border/20 text-white flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>

			<div className="flex flex-col md:flex-row items-center justify-center md:gap-6 gap-4 w-full">
				{total === 0 ? (
					<p className="text-gray-400">No data yet</p>
				) : (
					<div className="w-[250px] h-[250px] sm:w-[240px] sm:h-[240px] md:w-[200px] md:h-[200px] lg:w-[280px] lg:h-[280px]">
						<Pie data={data} options={options} />
					</div>
				)}

				<div className="text-center md:text-left">
					<div className="text-green-500 font-dm-sans">
						<span className="text-5xl sm:text-6xl lg:text-8xl font-bold">{luckyPercentage}%</span>
						<div className="text-xl sm:text-2xl font-poppins font-semibold">Lucky Percentage</div>
					</div>
				</div>
			</div>
		</div>
	);
}
