
import React, { useState } from 'react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * ResponsiveTestPage component
 * 
 * A development tool for testing responsive components and layouts
 * at different screen sizes and configurations.
 */
export const ResponsiveTestPage: React.FC = () => {
  const [gridGap, setGridGap] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [containerSize, setContainerSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("xl");
  const [gridColumns, setGridColumns] = useState<1 | 2 | 3 | 4 | undefined>(undefined);
  const [minItemWidth, setMinItemWidth] = useState(300);
  
  const responsive = useResponsive();
  
  const testItems = Array.from({ length: 6 }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `This is a test item for responsive layout testing. It contains enough text to potentially wrap to multiple lines.`
  }));
  
  return (
    <ResponsiveContainer size={containerSize} className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Responsive Test Page</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Use this page to test responsive components and layouts at different screen sizes.
        </p>
        
        <div className="bg-muted p-4 rounded-md mb-4">
          <h2 className="font-semibold mb-2">Current Device Information</h2>
          <ul className="space-y-1 text-sm">
            <li><strong>Breakpoint:</strong> {responsive.activeBreakpoint}</li>
            <li><strong>Screen Width:</strong> {responsive.screenWidth}px</li>
            <li><strong>Device Type:</strong> {responsive.isMobile ? 'Mobile' : responsive.isTablet ? 'Tablet' : 'Desktop'}</li>
            <li><strong>Orientation:</strong> {responsive.isPortrait ? 'Portrait' : 'Landscape'}</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Container Size</label>
            <Select
              value={containerSize}
              onValueChange={(value) => setContainerSize(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select container size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small (max-w-screen-sm)</SelectItem>
                <SelectItem value="md">Medium (max-w-screen-md)</SelectItem>
                <SelectItem value="lg">Large (max-w-screen-lg)</SelectItem>
                <SelectItem value="xl">X-Large (max-w-screen-xl)</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Grid Gap</label>
            <Select
              value={gridGap}
              onValueChange={(value) => setGridGap(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grid gap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Grid Columns</label>
            <Select
              value={gridColumns?.toString() || "auto"}
              onValueChange={(value) => setGridColumns(value === "auto" ? undefined : Number(value) as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (min-width: {minItemWidth}px)</SelectItem>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid Layout</TabsTrigger>
          <TabsTrigger value="container">Container Demo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Responsive Grid Test</h2>
          <ResponsiveGrid 
            gap={gridGap}
            columns={gridColumns}
            minItemWidth={minItemWidth}
            className="mb-8"
          >
            {testItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </ResponsiveGrid>
        </TabsContent>
        
        <TabsContent value="container" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Container Size Demo</h2>
          <div className="border border-dashed border-gray-300 dark:border-gray-600 p-4 rounded">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded text-center">
              <p>Container size: <strong>{containerSize}</strong></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This content is inside a ResponsiveContainer with size="{containerSize}"
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
};

export default ResponsiveTestPage;
