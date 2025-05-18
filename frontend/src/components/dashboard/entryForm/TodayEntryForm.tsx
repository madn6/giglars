import React, { useCallback, useEffect, useState } from 'react';
import { Check, Send, AlertTriangle } from 'lucide-react';
import { PiCloverFill } from 'react-icons/pi';
import { BsFillEmojiNeutralFill } from 'react-icons/bs';

import {
	submitTodayEntry,
	resetTodayEventState
} from '../../../redux/features/todayEntry/todayEntrySlice';
import { toast } from 'react-toastify';
import { CalendarCheck } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchMoodEntries } from '../../../redux/features/moodEntry/moodEntrySlice';

const TodayEntryForm: React.FC = () => {
	const dispatch = useAppDispatch();
	const { loading, error, success } = useAppSelector((state) => state.todayEntry);

	const [type, setType] = useState<'lucky' | 'unlucky' | 'neutral' | null>(null);
	const [description, setDescription] = useState('');
	const [intensity, setIntensity] = useState(2);

	const resetForm = () => {
		setType(null);
		setDescription('');
		setIntensity(2);
	};

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!type) {
				toast.error('Please select whether your day was lucky, unlucky, or neutral');
				return;
			}

			if ((type === 'lucky' || type === 'unlucky') && !description.trim()) {
				toast.error('Please provide a description of your day');
				return;
			}

			try {
				const payload = {
					type,
					description: type === 'neutral' && description === '' ? 'neutral' : description,
					intensity: type === 'neutral' ? 0 : intensity
				};
				await dispatch(submitTodayEntry(payload)).unwrap();

				// ✅ Refetch entries after successful submission
				dispatch(fetchMoodEntries());

				toast.success("Today's entry saved!");
				resetForm();
			} catch (err) {
				console.error('Submission error:', err);
				toast.error('Something went wrong. Try again.');
			}
		},
		[type, description, intensity, dispatch]
	);

	useEffect(() => {
		if (success || error) {
			dispatch(resetTodayEventState());
		}
	}, [success, error, dispatch]);

	return (
		<div className="bg-secondary font-inter backdrop-blur-md rounded-xl h-fit md:p-6 p-4 border border-border/20">
			<div className="flex items-center justify-center mb-6 gap-1">
				<div className="">
					<CalendarCheck  size={20}/>
				</div>
				<h2 className="text-xl font-semibold text-white ">Today's Entry</h2>
			</div>

			<form onSubmit={handleSubmit}>
				{/* Type Selector */}
				<div className="mb-6">
					<label className="block text-gray-text   font-medium mb-2">How was your day?</label>
					<div className="flex md:space-x-4 space-x-2 flex-wrap">
						<button
							type="button"
							onClick={() => setType(type === 'lucky' ? null : 'lucky')}
							className={`flex-1 md:py-2 md:px-2  lg:py-3 lg:px-4     py-2 px-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
								type === 'lucky'
									? 'bg-green-500/20 border border-green-500 text-green-200'
									: 'bg-gray border border-border/20 text-gray-text '
							}`}
						>
							<PiCloverFill className="mr-1" size={18} />
							Lucky
						</button>
						<button
							type="button"
							onClick={() => setType(type === 'unlucky' ? null : 'unlucky')}
							className={`flex-1 md:py-2 md:px-2  lg:py-3 lg:px-4     py-2 px-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
								type === 'unlucky'
									? ' bg-orange-500/20 border border-orange-500 text-orange-200'
									: 'bg-gray border border-border/20 text-gray-text '
							}`}
						>
							<div className="mr-1">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18}>
									<path
										fill="currentColor"
										fillRule="evenodd"
										d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464m4.933 13.983a.75.75 0 0 0 1.05.155A4.27 4.27 0 0 1 12 16.75a4.27 4.27 0 0 1 2.553.852a.75.75 0 1 0 .894-1.204A5.77 5.77 0 0 0 12 15.25a5.77 5.77 0 0 0-3.447 1.148a.75.75 0 0 0-.156 1.049M16 10.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5M9 12c.552 0 1-.672 1-1.5S9.552 9 9 9s-1 .672-1 1.5s.448 1.5 1 1.5"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							Unlucky
						</button>
						<button
							type="button"
							onClick={() => setType(type === 'neutral' ? null : 'neutral')}
							className={`flex-1  md:py-2 md:px-2  lg:py-3 lg:px-4     py-2 px-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
								type === 'neutral'
									? 'bg-blue-500/20 border border-blue-500 text-blue-200'
									: 'bg-gray border border-border/20 text-gray-text'
							}`}
						>
							<BsFillEmojiNeutralFill className="mr-1" size={18} />
							Neutral
						</button>
					</div>
				</div>

				{/* Description */}
				<div className="mb-6">
					<label className="block text-gray-text font-medium mb-2">What happened?</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
						className="w-full bg-gray border text-white border-border/20 focus:ring-0 outline-none rounded-lg p-3 resize-none"
						placeholder="Describe your lucky or unlucky event..."
					/>
				</div>

				{/* Intensity */}
				{type === 'lucky' || type === 'unlucky' ? (
					<div className="mb-6 flex items-center justify-center flex-col">
						<label className=" text-gray-text font-medium  mb-2">How intense was it?</label>
						<div className="flex gap-3">
							{['normal', 'mid', 'super'].map((level, index) => {
								const labels = {
									lucky: ['Normal', 'Mid', 'Super'],
									unlucky: ['Normal', 'Mid', 'Super']
								};

								const isActive = intensity === index + 1;

								const colorMap = {
									lucky: [
										'bg-green-500/20  border-green-500 text-green-300',
										'bg-green-700/20  border-green-700 text-green-400',
										'bg-green-900/20  border-green-900 text-green-500'
									],
									unlucky: [
										'bg-orange-500/20 border-orange-500 text-orange-300',
										'bg-orange-700/20 border-orange-700 text-orange-400',
										'bg-orange-900/20 border-orange-900 text-orange-500'
									]
								};
								const activeColor = colorMap[type][index];
								return (
									<button
										key={level}
										type="button"
										onClick={() => setIntensity(index + 1)}
										className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                        ${isActive ? activeColor : 'bg-gray border-border/20 text-gray-text'}
               `}
									>
										{labels[type][index]}
									</button>
								);
							})}
						</div>
					</div>
				) : null}

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
					{loading ? (
						'Saving...'
					) : (
						<>
							<Send className="mr-2" size={18} /> Save Entry
						</>
					)}
				</button>
			</form>
		</div>
	);
};

export default TodayEntryForm;
