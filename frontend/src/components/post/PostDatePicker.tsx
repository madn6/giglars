import 'react-day-picker/dist/style.css';
import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-react';


interface PostDatePicker {
	date: Date;
	setDate: (date: Date) => void;
}

export default function PostDatePicker({ date, setDate }: PostDatePicker) {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const handleDayClick = (selectedDate: Date) => {
		setDate(selectedDate);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div ref={wrapperRef} className="flex flex-col text-xs text-gray-400 relative">
			<span>When did it happen?</span>
			<button
				type="button"
				className="p-1 w-32 flex items-center justify-between rounded bg-gray-800 text-white outline-none"
				onClick={() => setIsOpen(!isOpen)}
			>
				{format(date, 'PPP')}
				{isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
			</button>

			{isOpen && (
				<div className="absolute top-12 z-50 bg-gray-800 p-2 rounded shadow custom-datepicker">
					<DayPicker
						mode="single"
						selected={date}
						onSelect={(selectedDate) => {
							if (selectedDate) {
								handleDayClick(selectedDate);
							}
						}}
						classNames={{
							day: ' rounded-md text-gray-400 hover:bg-gray-700 transition-all duration-200 ease-in-out',
							selected: 'bg-gray-600 text-white', // Custom selected day styles
							today: 'bg-blue-500 text-white', // Highlight today's date
							disabled: 'text-red-500 bg-transparent', // Disabled date style
							nav_button: ' rounded transition', // Common styles for both buttons
							nav_button_previous: 'text-red-500 hover:text-red-700', // Previous button (back)
							nav_button_next: 'text-green-500 hover:text-green-700'
						}}
					/>
				</div>
			)}
		</div>
	);
}
