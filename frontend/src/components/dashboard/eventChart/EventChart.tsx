import { Pie } from 'react-chartjs-2';
import { MoodEntry } from '../../../redux/features/moodEntry/moodEntryTypes';
import 'chart.js/auto';

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
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="lg:p-6 p-3 rounded-xl bg-secondary  border border-border/20 text-white flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
      <div className="flex items-center justify-center lg:gap-4  gap-2 w-full">
        {total === 0 ? (
          <p className="text-gray-400">No data yet</p>
        ) : (
          <div className="w-[280px] h-[280px]">
            <Pie data={data} options={options} />
          </div>
        )}
        <div className="text-2xl font-bold font-dm-sans text-green-500">
          <span className="lg:text-8xl text-4xl">{luckyPercentage}%</span> Lucky Percentage
        </div>
      </div>
    </div>
  );
}
