
import React, { useEffect } from 'react';
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
  const { isMobile, isTablet, activeBreakpoint } = useResponsive();

  // Log page load with device information
  useEffect(() => {
    logger.info('Rewards page loaded', { 
      breakpoint: activeBreakpoint,
      isMobile, 
      isTablet,
      userId: user?.id,
      hasError: !!error
    });
  }, [isMobile, isTablet, activeBreakpoint, user?.id, error]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="py-6 sm:py-8 md:py-12">
          <Skeleton className="h-8 sm:h-10 w-1/4 mb-4 sm:mb-6" />
          <Skeleton className="h-5 sm:h-6 w-1/2 mb-8 sm:mb-12" />
          <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-lg" />
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
        <Container className="py-6 sm:py-8 md:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('title')}</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-6 sm:mt-8">
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
      <main>
        <Container className="py-6 sm:py-8 md:py-12">
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('title')}</h1>
              <p className="text-muted-foreground">{t('description')}</p>
            </header>

            <MilestonesDashboard userId={user?.id} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Rewards;
