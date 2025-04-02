import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
	return (
		<div className="">
			<nav className="border-[rgba(255,255,255,0.18)] shadow-2xl border fixed font-poppins top-0 left-0 w-full bg-[rgba(0,0,0,0.6)] backdrop-blur-lg text-white z-50">
				<ul className="flex items-center justify-between px-5 py-4">
					<li className="font-rangile text-2xl text-orange-600">
						<Link to="/">Giglars</Link>
					</li>

					<div className="">
						<li className=" items-center  hidden md:flex gap-1">
							<img className="w-8" src="../../public/images/dice.png" alt="" />
							<p className='font-boyrun text-2xl'>Lucky or Unlucky ?  Share Your Story</p>
						</li>
					</div>
					<div className="flex items-center gap-2">
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/register">Register</Link>
						</li>
					</div>
				</ul>
			</nav>
			{/* <nav
				className="fixed bg-black text-white py-5 font-dm-sans
                w-full bottom-0 flex items-center justify-around md:w-[120px] md:h-auto md:left-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:space-y-4"
			>
				<ul className="flex w-full justify-around text-lg  md:flex-col md:space-y-8 md:w-auto">
					<li>
						<Link to="/lucky" className="flex items-center">
							<img className="w-7" src="../../public/images/clover.png" alt="" />
						</Link>
					</li>
					<li>
						<Link to="/unlucky" className="flex items-center">
							<img className="w-7" src="../../public/images/black-cat.png" alt="" />
						</Link>
					</li>
					<li>
						<Link to="/submit" className="flex items-center">
							<img className="w-8" src="../../public/images/post.png" alt="" />
						</Link>
					</li>
					<li>
						<Link to="/search" className="flex items-center">
							<img className="w-8" src="../../public/images/search.png" alt="" />
						</Link>
					</li>
					<li>
						<Link to="/login" className="flex items-center">
							<img className="w-8" src="../../public/images/user.png" alt="" />
						</Link>
					</li>
				</ul>
			</nav> */}
		</div>
	);
};

export default Navbar;
