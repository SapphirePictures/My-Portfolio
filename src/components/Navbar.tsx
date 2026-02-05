
import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
	{ label: 'Works', path: '/works' },
	{ label: 'Services', id: 'services' },
	{ label: 'About Me', id: 'about' },
	{ label: 'Admin', path: '/admin' },
];

const Navbar = ({ isDarkMode }: { isDarkMode: boolean }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setMenuOpen(false);
		}
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

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
			{/* Hamburger Icon */}
			<div className="flex justify-end p-6">
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

			{/* Overlay Menu with top-down animation */}
			<div
				className={`fixed inset-0 bg-[#f1f1f4] flex flex-col items-center z-50 transition-transform transition-opacity duration-500 ease-in-out
				${menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}
				style={{ justifyContent: 'center' }}
			>
				<div className="flex flex-col items-center gap-12">
					{navItems.map((item, idx) => (
						<div key={idx}>
							{'path' in item ? (
								<Link
									to={item.path}
									onClick={() => handleNavClick(item)}
									className={`text-3xl font-helvetica text-black focus:outline-none transform transition-all duration-200 hover:text-blue-600 block ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
									style={{ transitionDelay: menuOpen ? `${idx * 100 + 100}ms` : '0ms' }}
								>
									{item.label}
								</Link>
							) : (
								<button
									onClick={() => handleNavClick(item)}
									className={`text-3xl font-helvetica text-black focus:outline-none transform transition-all duration-200 hover:text-blue-600 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
									style={{ transitionDelay: menuOpen ? `${idx * 100 + 100}ms` : '0ms' }}
								>
									{item.label}
								</button>
							)}
						</div>
					))}
					<button
						onClick={() => scrollToSection('contact')}
						className={`mt-2 w-80 max-w-xs py-6 bg-blue-600 text-white text-2xl font-helvetica rounded-none focus:outline-none transform transition-all duration-200 hover:bg-blue-700 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}
						style={{ transitionDelay: menuOpen ? `${navItems.length * 100 + 100}ms` : '0ms' }}
					>
						Get in Touch
					</button>
				</div>
				{/* Close button (X) */}
				<button
					className="absolute top-8 right-8 text-4xl text-gray-700 focus:outline-none"
					aria-label="Close menu"
					onClick={() => setMenuOpen(false)}
				>
					&times;
				</button>
			</div>
		</nav>
	);
};

export default Navbar;