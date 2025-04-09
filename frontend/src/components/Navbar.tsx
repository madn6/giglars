import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import UserMenu from './UserMenu';

export interface UserMenuProps {
	isLoggedIn: boolean;
	user: {
		image: string;
		email: string;
		name: string;
	};
}
const Navbar: React.FC = () => {
	const profileImage = useSelector((state: RootState) => state.auth.profileImage);
	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
	const email = useSelector((state: RootState) => state.auth.email);
	const name = useSelector((state: RootState) => state.auth.name);
	console.log(profileImage);

	return (
		<div className="">
			<nav className="fixed bg-[#081420]  border-b border-border/20  top-0 left-0 w-full z-50 font-poppins text-white shadow-2xl  ">
				<ul className="flex items-center justify-between px-5 py-4">
					<li className="font-rangile text-2xl ">
						<Link to="/">Giglars</Link>
					</li>

					<div className="">
						<li className=" items-center  hidden md:flex gap-1">
							<img className="w-8" src="/images/dice.png" alt="" />
							<p className="font-romantic text-2xl">Lucky or Unlucky ? Share Your Story</p>
						</li>
					</div>
					<UserMenu
						isLoggedIn={isLoggedIn}
						user={{
							image: profileImage || '',
							email: email || '',
							name: name || ''
						}}
					/>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
