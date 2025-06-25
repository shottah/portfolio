import { Suspense } from 'react';
import InteractiveNameSection from './InteractiveNameSection';
import NameSkeleton from './NameSkeleton';

interface HomeSectionProps {
  adjectives: string[];
}

export default function HomeSection({ adjectives }: HomeSectionProps) {
  return (
    <section id="home" className="h-screen flex items-center justify-center p-8">
      <Suspense fallback={<NameSkeleton />}>
        <InteractiveNameSection adjectives={adjectives} />
      </Suspense>
    </section>
  );
}