import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface PostScheduleSelectorProps {
	scheduledDate: Date;
	setScheduledDate: (date: Date) => void;
}

export default function PostScheduleSelector({ scheduledDate, setScheduledDate }: PostScheduleSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Close on outside click
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
			<span>Schedule Post:</span>
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="p-1 w-34 md:w-38 flex items-center justify-between rounded bg-gray-800 text-white outline-none"
			>
				{scheduledDate.toLocaleDateString('en-GB')} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				{isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
			</button>

			{isOpen && (
				<div className="absolute top-12 z-50 bg-gray-800 p-2 rounded shadow">
					<DatePicker
						selected={scheduledDate}
						onChange={(date: Date | null) => {
							if (date) {
								setScheduledDate(date);
								setIsOpen(false); 
							}
						}}
						inline
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={15}
						dateFormat="Pp"
					/>
				</div>
			)}
		</div>
	);
}
