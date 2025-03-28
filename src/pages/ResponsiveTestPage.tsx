
import React, { useState } from 'react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategorySelection } from '@/components/services/CategorySelection';
import { ContactCTA } from '@/components/services/ContactCTA';

/**
 * ResponsiveTestPage
 * 
 * A comprehensive testing ground for responsive components.
 * This page displays various responsive components with controls
 * to toggle options and test different configurations.
 */
const ResponsiveTestPage: React.FC = () => {
  const { isMobile, isTablet, screenWidth, breakpoint } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState('monthly');
  const [columns, setColumns] = useState<number | undefined>(undefined);
  const [gap, setGap] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveContainer className="py-8">
        <h1 className="text-3xl font-bold mb-6">Responsive Components Test Page</h1>
        
        <div className="sticky top-0 z-10 bg-background py-4 mb-8 border-b">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="font-semibold">Current Breakpoint:</span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              {breakpoint} ({screenWidth}px)
            </span>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm",
              isMobile ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
            )}>
              {isMobile ? "Mobile" : "Not Mobile"}
            </span>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm",
              isTablet ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800" 
            )}>
              {isTablet ? "Tablet" : "Not Tablet"}
            </span>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-10">
          <TabsList>
            <TabsTrigger value="grid">Grid Components</TabsTrigger>
            <TabsTrigger value="container">Container Components</TabsTrigger>
            <TabsTrigger value="services">Service Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">ResponsiveGrid Testing</h2>
            
            <div className="mb-6 flex flex-wrap gap-3">
              <Button 
                variant={columns === undefined ? "default" : "outline"}
                onClick={() => setColumns(undefined)}
              >
                Auto
              </Button>
              {[1, 2, 3, 4].map(col => (
                <Button
                  key={col}
                  variant={columns === col ? "default" : "outline"}
                  onClick={() => setColumns(col)}
                >
                  {col} {col === 1 ? 'Column' : 'Columns'}
                </Button>
              ))}
            </div>
            
            <div className="mb-6 flex flex-wrap gap-3">
              {(["xs", "sm", "md", "lg", "xl"] as const).map(gapSize => (
                <Button
                  key={gapSize}
                  variant={gap === gapSize ? "default" : "outline"}
                  onClick={() => setGap(gapSize)}
                >
                  Gap: {gapSize}
                </Button>
              ))}
            </div>
            
            <ResponsiveGrid 
              columns={columns as any} 
              gap={gap}
              className="mb-10"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-secondary p-6 rounded-lg border flex items-center justify-center"
                >
                  <span className="text-lg font-medium">Grid Item {i + 1}</span>
                </div>
              ))}
            </ResponsiveGrid>
          </TabsContent>
          
          <TabsContent value="container" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">ResponsiveContainer Testing</h2>
            
            <div className="space-y-8">
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <p className="text-center text-sm text-muted-foreground mb-2">Default Container</p>
                <ResponsiveContainer className="bg-secondary/30 p-4 rounded-lg">
                  <div className="h-20 bg-secondary flex items-center justify-center rounded-lg">
                    <span>Default Container</span>
                  </div>
                </ResponsiveContainer>
              </div>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <p className="text-center text-sm text-muted-foreground mb-2">Small Container (max-w-screen-sm)</p>
                <ResponsiveContainer size="sm" className="bg-secondary/30 p-4 rounded-lg">
                  <div className="h-20 bg-secondary flex items-center justify-center rounded-lg">
                    <span>Small Container</span>
                  </div>
                </ResponsiveContainer>
              </div>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <p className="text-center text-sm text-muted-foreground mb-2">Fluid Container (w-full)</p>
                <ResponsiveContainer fluid className="bg-secondary/30 p-4 rounded-lg">
                  <div className="h-20 bg-secondary flex items-center justify-center rounded-lg">
                    <span>Fluid Container</span>
                  </div>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Service Components Testing</h2>
            
            <div className="space-y-8">
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-4">CategorySelection Component</h3>
                <CategorySelection 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={[
                    { id: 'monthly', name: 'Monthly' },
                    { id: 'quarterly', name: 'Quarterly' },
                    { id: 'annual', name: 'Annual' }
                  ]}
                />
              </div>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-4">ServicesGrid Component</h3>
                <ServicesGrid columns={2} gap="md">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-card p-6 rounded-lg border flex flex-col"
                    >
                      <h4 className="text-lg font-medium mb-2">Service Package {i + 1}</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        This is a sample service package description.
                      </p>
                      <div className="mt-auto pt-4 border-t">
                        <Button className="w-full">View Details</Button>
                      </div>
                    </div>
                  ))}
                </ServicesGrid>
              </div>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-4">ContactCTA Component</h3>
                <ContactCTA />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function for conditional className merging
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export default ResponsiveTestPage;
