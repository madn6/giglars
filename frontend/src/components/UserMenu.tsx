import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserMenuProps } from './Navbar';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import API from '../utils/axios';
import { toast } from 'react-toastify';

const UserMenu = ({ isLoggedIn, user }: UserMenuProps) => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			await API.post('/api/auth/logout', {}, { withCredentials: true });
			dispatch(logout());
			navigate('/');
			toast.success('Logged out successfully', { position: 'bottom-center' });
		} catch (err) {
			toast.error('Failed to logout', { position: 'bottom-center' });
			console.error(err);
		}
	};

	// ✅ If not logged in, just show a sign-in link
	if (!isLoggedIn) {
		return (
			<div className=" px-1 flex items-center gap-1">
				<img src="/images/entry.png" className='w-8'  alt="" />
				<Link to="/sign-in" onClick={()=>setOpen(false)} className="text-white hover:underline">
					Sign In
				</Link>
			</div>
		);
	}

	// ✅ If logged in, show profile image and dropdown
	return (
		<div className="relative" ref={menuRef}>
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
						{/* Menu Links */}
						<div className="flex flex-col space-y-1">
							<Link to="/update-profile" onClick={()=>setOpen(false)} className="block px-3 py-2 rounded hover:bg-[#081522] text-sm">
								Profile
							</Link>
							<Link to="/profile-settings" onClick={()=>setOpen(false)}  className="block px-3 py-2 rounded hover:bg-[#0B1C2C] text-sm">
								Settings
							</Link>
							<button
								onClick={handleLogout}
								className="text-left cursor-pointer text-sm text-red-500 hover:bg-[#111111] px-3 py-2 rounded"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
