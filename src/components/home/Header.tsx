import { Link, useRouter } from '@tanstack/react-router';
import { Github, ImageIcon, FileText } from 'lucide-react';
import { useMediaQuery } from 'react-haiku';
import FadeContent from '../animations/FadeContent.tsx';
import reactbitslogo from '../../assets/react.svg';

const Header: React.FC = () => {
	const router = useRouter();
	const isMobile = useMediaQuery('(max-width: 1024px)', false);
	const pathname = router.state.location.pathname;

	return (
		<header className="h-20 fixed top-0 z-50 w-full px-8 md:px-16 flex justify-center m-0 bg-black/50 shadow-md backdrop-blur-lg">
			<nav className="w-full h-full flex justify-between items-center max-w-screen-xl">
				<FadeContent blur>
					<Link to="/" className="min-w-[136px] md:w-[110px]">
						<img
							src={reactbitslogo}
							alt="The shape of a 3 point atom, representing a fraction of ReactJS"
							className="md:w-[110px]"
						/>
					</Link>
				</FadeContent>

				<div className="flex items-center justify-center gap-8">
					{!isMobile && (
						<FadeContent blur>
							<a
								href="https://github.com/DavidHDev/react-bits"
								target="_blank"
								rel="noopener noreferrer"
								className="h-12 font-medium text-base flex items-center justify-center rounded-xl border border-transparent transition-opacity duration-300 hover:opacity-70"
							>
								<Github className="mr-1.5" size={20} />
								GitHub
							</a>
						</FadeContent>
					)}

					<FadeContent blur>
						<Link
							to={pathname !== '/showcase' ? '/' : '/'}
							className="h-12 font-medium text-base flex items-center justify-center rounded-xl border border-transparent transition-opacity duration-300 hover:opacity-70"
						>
							{pathname !== '/showcase' ? (
								<>
									<ImageIcon className="mr-1.5" size={20} />
									Showcase
								</>
							) : (
								<>
									<FileText className="mr-1.5" size={20} />
									Docs
								</>
							)}
						</Link>
					</FadeContent>

					{!isMobile && pathname !== '/showcase' && (
						<FadeContent blur>
							<Link
								to="/"
								className="h-12 font-medium text-base flex items-center justify-center rounded-xl border border-transparent transition-opacity duration-300 hover:opacity-70"
							>
								<FileText className="mr-1.5" size={20} />
								Docs
							</Link>
						</FadeContent>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
