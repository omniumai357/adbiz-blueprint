
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionnaireProvider } from '@/contexts/questionnaire-context';
import { FormTextField } from '../FormTextField';
import { FormTextAreaField } from '../FormTextAreaField';
import { FormSelectField } from '../FormSelectField';
import { FormCheckboxField } from '../FormCheckboxField';
import { FormRadioGroupField } from '../FormRadioGroupField';
import { Form } from '@/components/ui/form';

// Test schema
const testSchema = z.object({
  textField: z.string().min(1, 'Text field is required'),
  textAreaField: z.string().min(10, 'Text area needs at least 10 characters'),
  selectField: z.string().min(1, 'Select field is required'),
  checkboxField: z.boolean(),
  radioField: z.string()
});

type TestFormValues = z.infer<typeof testSchema>;

// Test wrapper component
const TestFormWrapper: React.FC<{
  children: React.ReactNode;
  defaultValues?: Partial<TestFormValues>;
}> = ({ children, defaultValues }) => {
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      textField: '',
      textAreaField: '',
      selectField: '',
      checkboxField: false,
      radioField: '',
      ...defaultValues
    }
  });
  
  return (
    <QuestionnaireProvider form={form} hasLogo={undefined}>
      <Form {...form}>
        <form>{children}</form>
      </Form>
    </QuestionnaireProvider>
  );
};

describe('Form Field Components', () => {
  // TextField tests
  describe('FormTextField', () => {
    it('renders with label and required indicator', () => {
      render(
        <TestFormWrapper>
          <FormTextField name="textField" label="Text Field" required />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('Text Field')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
    
    it('shows character count when enabled', () => {
      render(
        <TestFormWrapper defaultValues={{ textField: 'Hello' }}>
          <FormTextField 
            name="textField" 
            label="Text Field" 
            maxLength={10} 
            showCharCount 
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('5 / 10')).toBeInTheDocument();
    });
  });
  
  // TextAreaField tests
  describe('FormTextAreaField', () => {
    it('renders with description', () => {
      render(
        <TestFormWrapper>
          <FormTextAreaField 
            name="textAreaField" 
            label="Text Area" 
            description="Enter detailed information"
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('Enter detailed information')).toBeInTheDocument();
    });
    
    it('shows character count by default', () => {
      render(
        <TestFormWrapper defaultValues={{ textAreaField: 'Hello world' }}>
          <FormTextAreaField 
            name="textAreaField" 
            label="Text Area"
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('11 characters')).toBeInTheDocument();
    });
  });
  
  // SelectField tests
  describe('FormSelectField', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    it('renders with options', () => {
      render(
        <TestFormWrapper>
          <FormSelectField 
            name="selectField" 
            label="Select Field"
            options={options}
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('Select Field')).toBeInTheDocument();
    });
  });
  
  // CheckboxField tests
  describe('FormCheckboxField', () => {
    it('renders with label', () => {
      render(
        <TestFormWrapper>
          <FormCheckboxField 
            name="checkboxField" 
            label="Checkbox Field"
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('Checkbox Field')).toBeInTheDocument();
    });
  });
  
  // RadioGroupField tests
  describe('FormRadioGroupField', () => {
    const options = [
      { value: 'option1', label: 'Option 1', description: 'Description 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    it('renders with options and descriptions', () => {
      render(
        <TestFormWrapper>
          <FormRadioGroupField 
            name="radioField" 
            label="Radio Field"
            options={options}
          />
        </TestFormWrapper>
      );
      
      expect(screen.getByText('Radio Field')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });
    
    it('supports horizontal orientation', () => {
      render(
        <TestFormWrapper>
          <FormRadioGroupField 
            name="radioField" 
            label="Radio Field"
            options={options}
            orientation="horizontal"
          />
        </TestFormWrapper>
      );
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('flex flex-row space-x-4');
    });
  });
});
