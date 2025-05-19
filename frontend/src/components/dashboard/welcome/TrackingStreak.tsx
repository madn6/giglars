type Props = {
  streak: number;
};

export default function TrackingStreak({ streak }: Props) {

  return (
    <div className='p-4 rounded-md border border-border text-white text-center'>
      <h3 className="text-lg font-semibold">🔥 Current Streak</h3>
      <p className="text-3xl font-bold text-yellow-400">{streak} days</p>
    </div>
  );
}
