type Props = {
  points: number;
};

export default function DailyQuiz({ points }: Props) {
  return (
    <div className="p-4 rounded-md border border-border text-white text-center">
      <div className="text-3xl">🧠</div>
      <p className="text-sm mt-1">Quiz Points</p>
      <p className="text-xl font-bold">{points}</p>
    </div>
  );
}
