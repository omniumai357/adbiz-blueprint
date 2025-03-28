
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRewardsPage } from '@/hooks/rewards/useRewardsPage';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';
import MilestonesDashboard from '@/components/rewards/MilestonesDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useResponsive } from '@/hooks/useResponsive';
import { createComponentLogger } from '@/lib/utils/logging';

const logger = createComponentLogger('RewardsPage');

const Rewards: React.FC = () => {
  const { t } = useTranslation('rewards');
  const { user, isLoading, error } = useRewardsPage();
  const { isMobile } = useResponsive();

  // Log page load with device information
  React.useEffect(() => {
    logger.info('Rewards page loaded', { 
      isMobile, 
      userId: user?.id,
      hasError: !!error
    });
  }, [isMobile, user?.id, error]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="py-8 md:py-12">
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
    // Handle different error types - error can be Error object or string
    const errorMessage = typeof error === 'object' && error !== null 
      ? error.message || 'Unknown error' 
      : String(error);
      
    logger.error('Error loading rewards page', { error: errorMessage });
      
    return (
      <>
        <Header />
        <Container className="py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-8">
            <p>Error loading rewards: {errorMessage}</p>
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
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('description')}</p>

        <MilestonesDashboard userId={user?.id} />
      </Container>
      <Footer />
    </>
  );
};

export default Rewards;
