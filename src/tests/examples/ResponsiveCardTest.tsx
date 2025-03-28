
/**
 * Example Responsive Card Test
 * 
 * This file demonstrates how to use the responsive testing utilities
 * to test a component across different breakpoints.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveTestWrapper from '../components/ResponsiveTestWrapper';
import { testAllBreakpoints, getSnapshotIdentifier } from '../utils/ResponsiveTestingUtils';
import { Breakpoint } from '@/hooks/useResponsive';

// Mock component to test
const SimpleCard = ({ title, content }: { title: string; content: string }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
);

describe('SimpleCard Responsive Tests', () => {
  // Test rendering at different breakpoints
  testAllBreakpoints(
    'renders correctly at different breakpoints',
    ['xs', 'sm', 'md', 'lg', 'xl'],
    (breakpoint: Breakpoint) => {
      const { container } = render(
        <ResponsiveTestWrapper breakpoint={breakpoint}>
          <SimpleCard 
            title="Test Card" 
            content="This is an example card to demonstrate responsive testing." 
          />
        </ResponsiveTestWrapper>
      );
      
      // In a real test, you would use toMatchImageSnapshot here
      expect(container).toBeInTheDocument();
      
      // Example of how you would use snapshot testing:
      // expect(container).toMatchImageSnapshot({
      //   customSnapshotIdentifier: getSnapshotIdentifier('SimpleCard', breakpoint)
      // });
    }
  );
  
  // Example of testing a specific state at a specific breakpoint
  it('renders correctly on mobile with long content', () => {
    const longContent = "This is a very long piece of content that might wrap differently on mobile devices compared to desktop. We want to ensure the component handles this gracefully.";
    
    const { container } = render(
      <ResponsiveTestWrapper breakpoint="xs">
        <SimpleCard 
          title="Long Content Test" 
          content={longContent} 
        />
      </ResponsiveTestWrapper>
    );
    
    expect(container).toBeInTheDocument();
    
    // Example of how you would use snapshot testing:
    // expect(container).toMatchImageSnapshot({
    //   customSnapshotIdentifier: getSnapshotIdentifier('SimpleCard', 'xs', 'long-content')
    // });
  });
});
