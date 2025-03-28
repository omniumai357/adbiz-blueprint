
import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponsiveContentPreview from '@/tests/visual/ResponsiveContentPreview';
import { ContentSection } from '@/components/ui/content-section';
import { ContentStack } from '@/components/ui/spacing';
import { ResponsiveHeading, ResponsiveText } from '@/components/ui/responsive-typography';

const DevTools = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'responsive';
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost">← Back to App</Button>
            </Link>
            <h1 className="text-xl font-bold">Developer Tools</h1>
          </div>
        </div>
      </header>
      
      <ContentSection padding="md">
        <ContentStack spacing="lg">
          <ResponsiveHeading as="h1" size="2xl">
            Development & Testing Tools
          </ResponsiveHeading>
          
          <ResponsiveText>
            These tools help you visualize and test various aspects of the application.
          </ResponsiveText>
          
          <Tabs defaultValue={currentTab} className="w-full">
            <TabsList className="mb-6">
              <Link to="/dev/responsive">
                <TabsTrigger value="responsive">Responsive Preview</TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
          
          <div className="w-full">
            <Routes>
              <Route path="responsive" element={<ResponsiveContentPreview />} />
              <Route path="*" element={<ResponsiveContentPreview />} />
            </Routes>
          </div>
        </ContentStack>
      </ContentSection>
    </div>
  );
};

export default DevTools;
