
import React from 'react';
import { ContentSection } from '@/components/ui/content-section';
import { ContentColumns } from '@/components/ui/content-columns';
import { Spacer, ContentStack } from '@/components/ui/spacing';
import { ResponsiveHeading, ResponsiveText } from '@/components/ui/responsive-typography';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Card, CardContent } from '@/components/ui/card';
import { useResponsive } from '@/hooks/useResponsive';

/**
 * ResponsiveContentPreview component
 * 
 * A test component that displays various content section layouts
 * to help visualize and test responsive behavior.
 */
export const ResponsiveContentPreview = () => {
  const { screenWidth, activeBreakpoint } = useResponsive();
  
  return (
    <div className="space-y-8">
      <div className="sticky top-0 bg-background z-10 p-4 border-b">
        <h1 className="text-lg font-bold">Responsive Content Preview</h1>
        <p className="text-sm text-muted-foreground">
          Current width: {screenWidth}px | Breakpoint: {activeBreakpoint}
        </p>
      </div>
      
      {/* Typography Example */}
      <ContentSection
        heading="Responsive Typography"
        description="Text components that automatically adapt to screen size"
        padding="md"
        divider
      >
        <ContentStack spacing="md">
          <ResponsiveHeading as="h1" size="4xl">Heading 1 (4XL)</ResponsiveHeading>
          <ResponsiveHeading as="h2" size="3xl">Heading 2 (3XL)</ResponsiveHeading>
          <ResponsiveHeading as="h3" size="2xl">Heading 3 (2XL)</ResponsiveHeading>
          <ResponsiveHeading as="h4" size="xl">Heading 4 (XL)</ResponsiveHeading>
          <ResponsiveHeading as="h5" size="lg">Heading 5 (LG)</ResponsiveHeading>
          <ResponsiveHeading as="h6" size="md">Heading 6 (MD)</ResponsiveHeading>
          
          <Spacer visible size="md" />
          
          <ResponsiveText size="xl">Extra large text example</ResponsiveText>
          <ResponsiveText size="lg">Large text example</ResponsiveText>
          <ResponsiveText size="base">Base text example</ResponsiveText>
          <ResponsiveText size="sm">Small text example</ResponsiveText>
          <ResponsiveText size="xs">Extra small text example</ResponsiveText>
          
          <Spacer visible size="md" />
          
          <ResponsiveText muted>
            This is muted text that has lower contrast and is typically used for
            secondary information or descriptions.
          </ResponsiveText>
        </ContentStack>
      </ContentSection>
      
      {/* Content Columns Example */}
      <ContentSection
        heading="Responsive Columns"
        description="Column layouts that stack on mobile and display side by side on larger screens"
        padding="md"
        divider
      >
        <ContentStack spacing="lg">
          <div className="space-y-2">
            <ResponsiveHeading as="h3" size="md">Equal Columns</ResponsiveHeading>
            <ContentColumns
              distribution="equal"
              left={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Left Column Content</ResponsiveText>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Right Column Content</ResponsiveText>
                  </CardContent>
                </Card>
              }
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveHeading as="h3" size="md">Left-Wide Columns</ResponsiveHeading>
            <ContentColumns
              distribution="left-wide"
              left={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Wider Left Column Content (60%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Narrower Right Column Content (40%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveHeading as="h3" size="md">Right-Wide Columns</ResponsiveHeading>
            <ContentColumns
              distribution="right-wide"
              left={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Narrower Left Column Content (40%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Wider Right Column Content (60%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveHeading as="h3" size="md">Custom Columns (70/30)</ResponsiveHeading>
            <ContentColumns
              distribution="custom"
              leftWidth="70%"
              rightWidth="30%"
              left={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Custom Width Left Column (70%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Custom Width Right Column (30%)</ResponsiveText>
                  </CardContent>
                </Card>
              }
            />
          </div>
          
          <div className="space-y-2">
            <ResponsiveHeading as="h3" size="md">Reversed Columns on Mobile</ResponsiveHeading>
            <ContentColumns
              distribution="equal"
              reverseMobile
              left={
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveText>Left Column (Shows Second on Mobile)</ResponsiveText>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardContent className="p-4 bg-primary/10">
                    <ResponsiveText>Right Column (Shows First on Mobile)</ResponsiveText>
                  </CardContent>
                </Card>
              }
            />
          </div>
        </ContentStack>
      </ContentSection>
      
      {/* Grid Example */}
      <ContentSection
        heading="Responsive Grid Layout"
        description="Grid that adapts column count based on screen size"
        padding="md"
        divider
      >
        <ContentStack spacing="lg">
          <ResponsiveHeading as="h3" size="md">Automatic Columns</ResponsiveHeading>
          <ResponsiveGrid minItemWidth={200} gap="md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <ResponsiveText>Grid Item {i}</ResponsiveText>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
          
          <ResponsiveHeading as="h3" size="md">Explicit Columns</ResponsiveHeading>
          <ResponsiveGrid columns={3} gap="md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <ResponsiveText>Grid Item {i}</ResponsiveText>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
        </ContentStack>
      </ContentSection>
      
      {/* Content Section Variants */}
      <ContentSection
        heading="Content Section Variants"
        description="Different background and padding styles for content sections"
        padding="md"
        divider
      >
        <ContentStack spacing="md">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ContentSection
                heading="Default Section"
                description="With default background"
                padding="sm"
                size="full"
              >
                <ResponsiveText>Content goes here</ResponsiveText>
              </ContentSection>
              
              <ContentSection
                heading="Muted Section"
                description="With muted background"
                padding="sm"
                variant="muted"
                size="full"
              >
                <ResponsiveText>Content goes here</ResponsiveText>
              </ContentSection>
              
              <ContentSection
                heading="Primary Section"
                description="With primary color background"
                padding="sm"
                variant="primary"
                size="full"
              >
                <ResponsiveText>Content goes here</ResponsiveText>
              </ContentSection>
              
              <ContentSection
                heading="Secondary Section"
                description="With secondary color background"
                padding="sm"
                variant="secondary"
                size="full"
              >
                <ResponsiveText>Content goes here</ResponsiveText>
              </ContentSection>
              
              <ContentSection
                heading="Accent Section"
                description="With accent color background"
                padding="sm"
                variant="accent"
                size="full"
              >
                <ResponsiveText>Content goes here</ResponsiveText>
              </ContentSection>
            </CardContent>
          </Card>
        </ContentStack>
      </ContentSection>
      
      {/* Spacing Examples */}
      <ContentSection
        heading="Responsive Spacing"
        description="Consistent spacing that adapts to screen size"
        padding="md"
      >
        <ContentStack spacing="md">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted-foreground/20 p-2">
              <ResponsiveText size="sm">Extra Small (XS) Spacing</ResponsiveText>
            </div>
            <div className="p-4">
              <div className="bg-muted h-8" />
              <Spacer size="xs" />
              <div className="bg-muted h-8" />
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted-foreground/20 p-2">
              <ResponsiveText size="sm">Small (SM) Spacing</ResponsiveText>
            </div>
            <div className="p-4">
              <div className="bg-muted h-8" />
              <Spacer size="sm" />
              <div className="bg-muted h-8" />
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted-foreground/20 p-2">
              <ResponsiveText size="sm">Medium (MD) Spacing</ResponsiveText>
            </div>
            <div className="p-4">
              <div className="bg-muted h-8" />
              <Spacer size="md" />
              <div className="bg-muted h-8" />
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted-foreground/20 p-2">
              <ResponsiveText size="sm">Large (LG) Spacing</ResponsiveText>
            </div>
            <div className="p-4">
              <div className="bg-muted h-8" />
              <Spacer size="lg" />
              <div className="bg-muted h-8" />
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted-foreground/20 p-2">
              <ResponsiveText size="sm">Extra Large (XL) Spacing</ResponsiveText>
            </div>
            <div className="p-4">
              <div className="bg-muted h-8" />
              <Spacer size="xl" />
              <div className="bg-muted h-8" />
            </div>
          </div>
        </ContentStack>
      </ContentSection>
    </div>
  );
};

export default ResponsiveContentPreview;
