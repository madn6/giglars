import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserMenuProps } from '../Navbar';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import API from '../../../utils/axios';
import { toast } from 'react-toastify';
import { GoDotFill } from 'react-icons/go';
import { CgProfile } from 'react-icons/cg';
import { IoSettingsSharp } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDashboard } from 'react-icons/md';
import { ChevronDown } from 'lucide-react';

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
				<img src="/images/entry.png" className="w-8" alt="" />
				<Link to="/sign-in" onClick={() => setOpen(false)} className="text-white hover:underline">
					Sign In
				</Link>
			</div>
		);
	}

	// ✅ If logged in, show profile image and dropdown
	return (
		<div className="relative" ref={menuRef}>
			{isLoggedIn && (
				<div className="flex items-center gap-1">
					<div className="cursor-pointer">
						<img
							onClick={() => setOpen((prev) => !prev)}
							className="w-10 h-10 relative border-2  border-white/70 rounded-full  object-cover shadow-md hover:shadow-lg"
							src={user.image}
							alt={user.name}
						/>
						<span className="absolute bottom-6 left-6 text-5xl  text-green-600">
							<GoDotFill size={20} className="stroke-1 stroke-black/50" />
						</span>
					</div>
					<div className="cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
						<motion.div
							initial={false}
							animate={{ rotate: open ? 180 : 0 }}
							transition={{ duration: 0.2 }}
							className=""
						>
							<ChevronDown size={20} />
						</motion.div>
					</div>
				</div>
			)}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.5, originX: 1, originY: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.2 }}
						className="absolute text-white right-0 mt-2 w-48 bg-secondary border border-border/20 rounded-lg shadow-2xl z-50 p-2"
					>
						<div className="flex flex-col">
							{/* Header */}
							<div className="border-b border-border/20 pb-1 mb-2">
								<p className="text-base px-3 font-medium text-accent">{user.name}</p>
								<p className="text-sm px-3 mb-1 truncate">{user.email}</p>
							</div>
							{/* Menu Links */}
							<div className="flex flex-col space-y-1">
								<Link to="/update-profile" onClick={() => setOpen(false)}>
									<div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray text-base">
										<CgProfile size={20} />
										Profile
									</div>
								</Link>

								<Link to="/dashboard" onClick={() => setOpen(false)}>
									<div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray text-base">
										<MdDashboard size={20} />
										Dashboard
									</div>
								</Link>

								<Link to="/profile-settings" onClick={() => setOpen(false)}>
									<div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray text-base">
										<IoSettingsSharp size={20} />
										Settings
									</div>
								</Link>

								<button onClick={handleLogout} className="cursor-pointer text-base text-red-500">
									<div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray text-base">
										<FiLogOut size={20} />
										Logout
									</div>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserMenu;
