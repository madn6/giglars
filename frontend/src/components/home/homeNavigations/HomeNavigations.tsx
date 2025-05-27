import { Link, useLocation } from 'react-router-dom';
import { GiDogHouse } from 'react-icons/gi';
import { PiCloverFill } from 'react-icons/pi';
import { MdOutlineAddCircle } from 'react-icons/md';
import { BiSearchAlt } from 'react-icons/bi';
import { JSX } from 'react';

interface HomeNavigationsProps {
	feelingFilter: (feeling: 'lucky' | 'unlucky' | 'all') => void;
}

const navItems: {
	to: string;
	icon: JSX.Element;
	match: string;
	feeling: 'lucky' | 'unlucky' | 'all';
}[] = [
	{ to: '/', icon: <GiDogHouse size={24} />, match: '/', feeling: 'all' },
	{ to: '/lucky', icon: <PiCloverFill size={24} />, match: '/lucky', feeling: 'lucky' },
	{
		to: '/unlucky',
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464m4.933 13.983a.75.75 0 0 0 1.05.155A4.27 4.27 0 0 1 12 16.75a4.27 4.27 0 0 1 2.553.852a.75.75 0 1 0 .894-1.204A5.77 5.77 0 0 0 12 15.25a5.77 5.77 0 0 0-3.447 1.148a.75.75 0 0 0-.156 1.049M16 10.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5M9 12c.552 0 1-.672 1-1.5S9.552 9 9 9s-1 .672-1 1.5s.448 1.5 1 1.5"
					clipRule="evenodd"
				/>
			</svg>
		),
		match: '/unlucky',
		feeling: 'unlucky'
	},
	{
		to: '/create-post',
		icon: <MdOutlineAddCircle size={24} />,
		match: '/create-post',
		feeling: 'all'
	},
	{ to: '/search', icon: <BiSearchAlt size={24} />, match: '/search', feeling: 'all' }
];

const HomeNavigations: React.FC<HomeNavigationsProps> = ({ feelingFilter }) => {
	const { pathname } = useLocation();

	return (
		<nav
			className="bg-primary border-t md:border-l-0 md:border-t md:border-b md:border-r z-50 :border-b border-border/20 text-white py-5 fixed bottom-0 w-full flex justify-around 
         md:w-[120px] md:h-[350px] md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-6 
         rounded-tl-xl rounded-tr-xl rounded-bl-none rounded-br-none
         md:rounded-tl-none md:rounded-bl-none md:rounded-tr-xl md:rounded-br-xl"
		>
			<ul className="flex w-full justify-around md:flex-col md:w-auto md:items-center md:space-y-6">
				{navItems.map(({ to, icon, feeling }, idx) => (
					<li key={idx}>
						<Link
							to={to}
							className={`rounded-lg p-2 flex items-center justify-center transition-all duration-200 ${
								pathname === to ? 'bg-secondary' : ''
							}`}
							onClick={() => feelingFilter(feeling)}
						>
							<span
								className={`inline-block transition-transform duration-200 hover:scale-110 ${
									pathname === to ? 'text-accent' : 'text-white'
								}`}
							>
								{icon}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default HomeNavigations;
