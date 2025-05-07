import { useEffect, useState, useRef } from 'react';

interface ReadMoreHTMLProps {
	html: string;
	charLimit?: number;
}

const ReadMoreHTML = ({ html, charLimit = 150 }: ReadMoreHTMLProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [plainText, setPlainText] = useState('');
	const shouldTruncate = useRef(false); // Only set once

	useEffect(() => {
		const tempEl = document.createElement('div');
		tempEl.innerHTML = html;
		const text = tempEl.textContent || tempEl.innerText || '';
		setPlainText(text);

		if (text.length > charLimit) {
			shouldTruncate.current = true;
		}
	}, [html, charLimit]);

	return (
		<div>
			<div className="transition-all text-white/90">
				{isExpanded ? plainText : `${plainText.slice(0, charLimit)}...`}
			</div>

			{shouldTruncate.current && (
				<button
					onClick={() => setIsExpanded((prev) => !prev)}
					className="mt-2 text-sm text-blue-400 hover:underline"
				>
					{isExpanded ? 'Show less' : 'Show more'}
				</button>
			)}
		</div>
	);
};

export default ReadMoreHTML;
