import { useEffect, useState } from 'react';

interface ReadMoreHTMLProps {
	html: string;
	charLimit?: number;
}

const ReadMoreHTML = ({ html, charLimit = 150 }: ReadMoreHTMLProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [plainText, setPlainText] = useState('');

	useEffect(() => {
		const tempEl = document.createElement('div');
		tempEl.innerHTML = html;
		const text = tempEl.textContent || tempEl.innerText || '';
		setPlainText(text);
	}, [html]);

	const shouldTruncate = plainText.length > charLimit;

	return (
		<div className="text-white">
			<div>
				{isExpanded || !shouldTruncate ? (
					<div dangerouslySetInnerHTML={{ __html: html }} />
				) : (
					<div>
						{plainText.slice(0, charLimit)}
						{'...'}
					</div>
				)}
			</div>

			{shouldTruncate && (
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
