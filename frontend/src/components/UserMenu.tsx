import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserMenuProps } from './Navbar';

const UserMenu = ({ isLoggedIn, user }: UserMenuProps) => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	if (!isLoggedIn) {
		return (
			<div className="text-sm">
				<Link className="" to="/sign-in">
					Sign In
				</Link>
			</div>
		);
	}

	return (
		<div className="relative " ref={menuRef}>
			<img
				onClick={() => setOpen((prev) => !prev)}
				className="w-9 h-9 rounded-full cursor-pointer shadow-md hover:shadow-lg"
				src={user.image}
				alt={user.name}
			/>
			{open && (
				<div className="absolute text-white right-0 mt-2 w-48 bg-primary border border-border rounded-lg shadow-lg z-50 p-2">
					<div className="flex flex-col">
						{/* Header */}
						<div className="border-b border-border pb-1 mb-2">
							<p className="text-sm px-3 font-medium">{user.name}</p>
							<p className="text-xs px-3 mb-1 truncate">{user.email}</p>
						</div>
						<div className="flex flex-col space-y-1">
							<div className="px-1">
								<Link to="/profile" className="block px-3 py-2 rounded hover:bg-[#111111] text-sm">
									Profile
								</Link>
							</div>
							<div className="px-1">
								<Link to="/settings" className="block px-3 py-2 rounded hover:bg-[#111111] text-sm">
									Settings
								</Link>
							</div>
							<div className="px-1">
								<Link
									to="/logout"
									className="block px-3 py-2 rounded hover:bg-[#111111] text-sm text-red-500"
								>
									Logout
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
