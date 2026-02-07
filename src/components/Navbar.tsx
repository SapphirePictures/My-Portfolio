
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
	{ label: 'Home', path: '/' },
	{ label: 'Works', path: '/works' },
	// { label: 'Services', id: 'services' },
	{ label: 'About Me', id: 'about' },
	{ label: 'Admin', path: '/admin' },
];

const Navbar = ({ isDarkMode }: { isDarkMode: boolean }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const scrollToSection = (id: string) => {
		if (location.pathname !== '/') {
			navigate(`/#${id}`);
			setMenuOpen(false);
			return;
		}

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setMenuOpen(false);
	};

	const goToAbout = () => {
		scrollToSection('about');
	};

	const handleNavClick = (item: typeof navItems[0]) => {
		if ('path' in item) {
			setMenuOpen(false);
		} else if (item.id === 'about') {
			goToAbout();
		} else {
			scrollToSection(item.id);
		}
	};

	useEffect(() => {
		// Lock scroll when menu is open
		if (menuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [menuOpen])

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-40 bg-transparent">
				{/* Hamburger Icon */}
				<div className={`flex justify-end p-6 relative z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
					<button
						className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
						aria-label="Open menu"
						onClick={() => setMenuOpen(true)}
					>
						<span className={`block w-8 h-1 mb-1 rounded transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
						<span className={`block w-8 h-1 mb-1 rounded transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
						<span className={`block w-8 h-1 rounded transition-all duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
					</button>
				</div>
			</nav>

			{/* Overlay Menu - Always in DOM for transitions */}
			<div
				className={`fixed inset-0 bg-[#f1f1f4] flex flex-col items-center z-30 transition-all duration-500 ease-in-out ${
					menuOpen 
						? 'translate-y-0 opacity-100 pointer-events-auto' 
						: '-translate-y-full opacity-0 pointer-events-none'
				}`}
				style={{ justifyContent: 'center' }}
				onClick={() => setMenuOpen(false)}
			>
					<div className="flex flex-col items-center gap-12 pointer-events-auto">
						{navItems.map((item, idx) => (
							<div key={idx}>
								{'path' in item ? (
									<Link
										to={item.path || '/'}
										onClick={() => handleNavClick(item)}
										className={`text-3xl font-helvetica text-black focus:outline-none transform transition-transform transition-opacity duration-500 hover:text-blue-600 block ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
										style={{ transitionDelay: menuOpen ? `${idx * 100 + 100}ms` : '0ms' }}
									>
										{item.label}
									</Link>
								) : (
									<button
										onClick={() => handleNavClick(item)}
										className={`text-3xl font-helvetica text-black focus:outline-none transform transition-transform transition-opacity duration-500 hover:text-blue-600 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
										style={{ transitionDelay: menuOpen ? `${idx * 100 + 100}ms` : '0ms' }}
									>
										{item.label}
									</button>
								)}
							</div>
						))}
						<button
							onClick={() => scrollToSection('contact')}
							className={`mt-2 w-80 max-w-xs py-6 border-2 border-blue-600 text-blue-600 text-2xl font-helvetica rounded-none focus:outline-none transform transition-transform transition-opacity duration-500 hover:bg-blue-600 hover:text-white ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
							style={{ transitionDelay: menuOpen ? `${navItems.length * 100 + 100}ms` : '0ms' }}
						>
							Get in Touch
						</button>
					</div>
					{/* Close button - Moved down to avoid navbar coverage */}
					<button
						className="absolute top-24 right-8 text-5xl text-gray-700 focus:outline-none z-50 cursor-pointer w-12 h-12 flex items-center justify-center hover:text-gray-900 transition-colors"
						aria-label="Close menu"
						onClick={(e) => {
							e.stopPropagation()
							setMenuOpen(false)
						}}
					>
						&times;
					</button>
			</div>
		</>
	);
};

export default Navbar;