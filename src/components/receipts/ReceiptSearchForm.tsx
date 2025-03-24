
import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Search, X } from "lucide-react";
import { ReceiptSearchParams } from "./types";

interface ReceiptSearchFormProps {
  onSearch: (params: ReceiptSearchParams) => void;
  onReset: () => void;
}

const ReceiptSearchForm = ({ onSearch, onReset }: ReceiptSearchFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const form = useForm<ReceiptSearchParams>({
    defaultValues: {
      query: '',
      dateFrom: '',
      dateTo: '',
      minAmount: undefined,
      maxAmount: undefined
    }
  });

  const handleSubmit = (data: ReceiptSearchParams) => {
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    );
    
    onSearch(filteredData as ReceiptSearchParams);
  };

  const handleReset = () => {
    form.reset({
      query: '',
      dateFrom: '',
      dateTo: '',
      minAmount: undefined,
      maxAmount: undefined
    });
    onReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="relative w-full">
                  <FormControl>
                    <Input 
                      placeholder="Search by invoice number or package..." 
                      className="pr-10"
                      {...field} 
                    />
                  </FormControl>
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="shrink-0">
            Search
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="shrink-0"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Simple Search' : 'Advanced Search'}
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            className="shrink-0"
            onClick={handleReset}
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </form>
    </Form>
  );
};

export default ReceiptSearchForm;
