
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRewardsPage } from '@/hooks/rewards/useRewardsPage';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';
import MilestonesDashboard from '@/components/rewards/MilestonesDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Rewards: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading, error } = useRewardsPage();

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="py-12">
          <Skeleton className="h-10 w-1/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </Container>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <Container className="py-12">
          <h1 className="text-3xl font-bold mb-2">{t('rewards.title')}</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-8">
            <p>Error loading rewards: {error.message}</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-2">{t('rewards.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('rewards.description')}</p>

        <MilestonesDashboard userId={user?.id} />
      </Container>
      <Footer />
    </>
  );
};

export default Rewards;
