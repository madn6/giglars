type Props = {
  correct: number;
  incorrect: number;
  streak: number;
};

export default function PredictionTracker({ correct, incorrect, streak }: Props) {
  const total = correct + incorrect;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="p-4 rounded-md border border-border text-white text-center">
      <div className="text-3xl">🔮</div>
      <p className="text-sm">Prediction Accuracy</p>
      <p className="text-md mt-1">✅ {correct}  ❌ {incorrect}</p>
      <p className="text-md">🎯 Accuracy: {accuracy}%</p>
      <p className="text-md">🔁 Streak: {streak}</p>
    </div>
  );
}
