import { redirect } from 'next/navigation';

// 2.5D Charminar street / puzzle experience disabled for now
// import WalkingExperience from '../components/charminar/WalkingExperience.jsx';

export const metadata = {
  title: 'Walk Charminar Street — Mapping HYD',
  description: 'Walk a continuous Old City street from Charminar square through the bazaar into a quiet courtyard.',
};

export default function CharminarPage() {
  redirect('/');
  // return <WalkingExperience />;
}
