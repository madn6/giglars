import React, { useCallback, useState } from 'react';
import { Check, X, Send, AlertTriangle } from 'lucide-react';

const TodayEntryForm: React.FC = () => {
	const [type, setType] = useState<'lucky' | 'unlucky' | null>(null);
	const [description, setDescription] = useState('');
	const [intensity, setIntensity] = useState(2);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const resetForm = () => {
		setType(null);
		setDescription('');
		setIntensity(2);
	};

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setError('');

			if (!type) {
				setError('Please select whether your day was lucky or unlucky');
				return;
			}

			if (!description.trim()) {
				setError('Please provide a description of your day');
				return;
			}

			// Placeholder: replace with actual API call
			console.log({ type, description, intensity });

			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);

			resetForm();
		},
		[type, description, intensity]
	);

	return (
		<div className="bg-secondary font-inter backdrop-blur-md rounded-xl p-6 border border-border/20">
			<h2 className="text-xl font-semibold text-white mb-6">Today's Entry</h2>

			<form onSubmit={handleSubmit}>
				{/* Type Selector */}
				<div className="mb-6">
					<label className="block text-white text-sm font-medium mb-2">How was your day?</label>
					<div className="flex space-x-4">
						<button
							type="button"
							onClick={() => setType('lucky')}
							className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 ${
								type === 'lucky'
									? 'bg-green-500/20 border border-green-500 text-green-200'
									: 'bg-gray border border-border/20 text-gray-300 '
							}`}
						>
							<Check className="mr-2" size={18} />
							Lucky
						</button>
						<button
							type="button"
							onClick={() => setType('unlucky')}
							className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 ${
								type === 'unlucky'
									? ' bg-orange-500/20 border border-orange-500 text-orange-200'
									: 'bg-gray border border-border/20 text-gray-300 '
							}`}
						>
							<X className="mr-2" size={18} />
							Unlucky
						</button>
					</div>
				</div>

				{/* Description */}
				<div className="mb-6">
					<label className="block text-gray-300 text-sm font-medium mb-2">What happened?</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
						className="w-full bg-gray border border-border/20 focus:ring-0 outline-none rounded-lg p-3 text-gray-200 resize-none"
						placeholder="Describe your lucky or unlucky event..."
					/>
				</div>

				{/* Intensity */}

				{type && (
					<div className="mb-8">
						<label className="block text-gray-300 text-sm font-medium mb-3">
							How intense was it?
						</label>
						<div className="flex gap-3">
							{['normal', 'mid', 'super'].map((level, index) => {
								const labels = {
									lucky: ['Normal Lucky', 'Mid Lucky', 'Super Lucky'],
									unlucky: ['Normal Unlucky', 'Mid Unlucky', 'Super Unlucky']
								};
								const isActive = intensity === index + 1;
								return (
									<button
										key={level}
										type="button"
										onClick={() => setIntensity(index + 1)}
										className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
              ${
								isActive
									? type === 'lucky'
										? 'bg-green-500/20 border-green-500 text-white'
										: 'bg-red-500/20 border-red-500 text-white'
									: 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
							}
            `}
									>
										{labels[type][index]}
									</button>
								);
							})}
						</div>
					</div>
				)}

				{/* Error or Success Messages */}
				{error && (
					<div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-center">
						<AlertTriangle className="text-red-400 mr-2" size={18} />
						<span className="text-sm text-red-200">{error}</span>
					</div>
				)}
				{success && (
					<div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg flex items-center">
						<Check className="text-green-400 mr-2" size={18} />
						<span className="text-sm text-green-200">Entry successfully saved!</span>
					</div>
				)}

				{/* Submit */}
				<button
					type="submit"
					className="w-full py-3 px-4 bg-accent/80 hover:bg-accent text-black font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
				>
					<Send className="mr-2" size={18} />
					Save Entry
				</button>
			</form>
		</div>
	);
};

export default TodayEntryForm;
