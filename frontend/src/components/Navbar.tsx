import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
	return (
		<div className="">
			<nav className="fixed md:bg-primary top-0 left-0 w-full z-50 font-poppins text-white shadow-2xl backdrop-blur-md bg-[#232323]/1 ">
				<ul className="flex items-center justify-between px-5 py-4">
					<li className="font-rangile text-2xl ">
						<Link to="/">Giglars</Link>
					</li>

					<div className="">
						<li className=" items-center  hidden md:flex gap-1">
							<img className="w-8" src="/images/dice.png" alt="" />
							<p className="font-boyrun text-2xl">Lucky or Unlucky ? Share Your Story</p>
						</li>
					</div>
					<div className="flex items-center gap-2">
						<img className="w-8" src="../../public/images/entry.png" alt="" />
						<li>
							<Link to="/login">Login</Link>
						</li>
					</div>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
