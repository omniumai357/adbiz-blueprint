
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      // Testing Library custom matchers
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveFocus(): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveStyle(css: Record<string, any>): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveValue(value?: string | string[] | number): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toBeEmpty(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}

// Re-export jest-dom
export {};
