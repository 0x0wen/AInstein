import { createFileRoute } from '@tanstack/react-router';
import Hero from '../components/home/Hero';
import Header from '../components/home/Header.tsx';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<div>
			<Header />
			<Hero />
			<Hero />
			<Hero />
		</div>
	);
}
