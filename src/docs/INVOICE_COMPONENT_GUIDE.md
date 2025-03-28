
# Responsive Invoice Components Guide

This guide describes our invoice components and their responsive behavior across different device sizes.

## Key Components

### ResponsiveInvoiceViewer

The `ResponsiveInvoiceViewer` component provides a flexible interface for viewing invoices on any device size.

#### Features

- Responsive scaling and layout adjustments
- Touch-friendly controls on mobile
- Interactive zooming and rotation controls
- Print, download, and share actions
- Optimized rendering for different screens

#### Usage

```tsx
<ResponsiveInvoiceViewer
  invoiceId="INV-12345"
  invoiceNumber="INV-12345"
  invoiceHtml={invoiceHtml}
  isLoading={isLoading}
  isPrinting={isPrinting}
  onPrint={handlePrintInvoice}
  onDownload={handleDownloadInvoice}
  onShare={handleShareInvoice}
/>
```

#### Responsiveness

- **Mobile:** Simplified UI with gesture controls and fixed footer
- **Tablet:** Standard controls with moderate details
- **Desktop:** Full feature set including zoom, rotate, and all action buttons

### CheckoutSuccess

Displays order confirmation with animations and convenient invoice actions.

#### Features

- Animated success confirmation
- Visual indicators for invoice generation
- Multiple action buttons for next steps
- Responsive layout adjustments

#### Usage

```tsx
<CheckoutSuccess
  orderId="order-12345"
  packageName="Premium Package"
  invoiceNumber="INV-12345"
  isGeneratingInvoice={isGeneratingInvoice}
  userId={userId}
/>
```

### CheckoutProgress

Shows the user's progress through the checkout flow.

#### Features

- Visual step indicators
- Current step highlighting
- Responsive adjustment based on screen size
- Animated transitions between steps

#### Usage

```tsx
<CheckoutProgress
  currentStep="payment"
  className="mb-6"
/>
```

## Hooks

### useInvoiceDownload

This hook handles fetching and manipulating invoice data.

#### Features

- Asynchronous invoice loading
- PDF generation and download
- Print preparation with optimized formatting
- Web Share API integration with fallbacks

#### Usage

```tsx
const { 
  invoiceHtml, 
  isLoading, 
  isPrinting,
  printInvoice, 
  downloadInvoice, 
  shareInvoice 
} = useInvoiceDownload(invoiceNumber, userId);
```

## Responsive Behavior

### Mobile Considerations

- Touch-friendly controls
- Simplified UI with focused content
- Gesture-based interactions
- Bottom navigation controls
- Progressive loading indicators

### Tablet Considerations

- Intermediate layouts
- More visible controls
- Contextual information
- Column adjustments

### Desktop Considerations

- Full feature visibility
- Side-by-side layouts
- Hover states
- Keyboard shortcuts

## Animation Guide

The components use subtle animations to enhance the user experience:

- Success confirmation: Fade-in and scale
- Progress indicators: Color transitions and fills
- Invoice loading: Progressive indicators
- Action feedback: Button states and toast notifications

## Best Practices

1. Always test on multiple screen sizes
2. Ensure touch targets are at least 44x44px on mobile
3. Provide clear feedback for all user actions
4. Implement logical tab order for keyboard navigation
5. Use progressive enhancement for advanced features
6. Ensure critical actions work without JavaScript
7. Optimize invoice HTML for print media
8. Use appropriate error states with recovery options

