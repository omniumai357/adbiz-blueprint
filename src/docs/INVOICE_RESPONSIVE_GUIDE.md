
# Responsive Invoice System Guide

This document outlines best practices and implementation details for the responsive invoice system.

## Core Principles

1. **Seamless Experience Across Devices**: The invoice system adapts perfectly to any device size while maintaining functionality.
2. **Performance-First Approach**: Optimized for fast loading and rendering, even on slower mobile connections.
3. **Context-Aware Interactions**: Controls and options change based on device capabilities.
4. **Accessibility**: All invoice features remain accessible regardless of viewport size.
5. **Progressive Enhancement**: Mobile users get a streamlined experience that expands with screen size.

## Responsive Components

### InvoiceViewer

The invoice viewer employs different viewing strategies based on screen size:

- **Mobile**: Simplified controls with touch-optimized gestures
- **Tablet**: Standard viewing interface with moderate controls
- **Desktop**: Full-featured interface with all options visible

```tsx
// Mobile-specific view with gesture support
{isMobile && (
  <div className="touch-controls">
    <GestureHandler onPinch={handleZoom} onSwipe={handlePageChange}>
      <div className="invoice-page">{/* Invoice content */}</div>
    </GestureHandler>
  </div>
)}

// Desktop-specific controls
{!isMobile && (
  <div className="control-panel">
    <ZoomControls value={zoom} onChange={setZoom} />
    <PageControls currentPage={page} totalPages={totalPages} />
  </div>
)}
```

### InvoiceActions

Invoice actions adapt based on available screen space:

- **Mobile**: Actions arranged vertically in order of importance
- **Tablet/Desktop**: Actions displayed horizontally with equal prominence

```tsx
<div className={cn("invoice-actions", isMobile ? "flex-col" : "flex-row")}>
  <Button onClick={handleDownload}>Download PDF</Button>
  <Button onClick={handlePrint}>Print Invoice</Button>
  {!isMobile && <Button onClick={handleShare}>Share</Button>}
</div>
```

### InvoiceProgress

For invoice generation/loading progress:

- **Mobile**: Simplified linear indicator with percentage
- **Desktop**: Detailed progress with step indicators

## Responsive Testing Protocol

When testing the invoice system, verify these key aspects:

1. **Rendering**: Invoice renders correctly at all breakpoints
2. **Interaction**: All controls function as expected on touch and mouse
3. **Printing**: Test print functionality across devices
4. **Download**: Verify PDF generation works across browsers

## Implementation Guidelines

1. Use fluid scaling for invoice content:
   ```css
   .invoice-content {
     width: 100%;
     max-width: min(800px, 90vw);
     transform-origin: top center;
   }
   ```

2. Implement appropriate loading states for slower connections:
   ```tsx
   {isLoading ? (
     <ProgressiveLoadingIndicator steps={['Preparing', 'Generating', 'Finalizing']} />
   ) : (
     <InvoiceContent />
   )}
   ```

3. Ensure all text remains readable at all sizes:
   ```css
   .invoice-text {
     font-size: clamp(14px, 3vw, 16px);
   }
   ```

By following these guidelines, the invoice system will provide an optimal experience for all users regardless of their device.
