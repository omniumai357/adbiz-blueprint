
export interface Receipt {
  id: string;
  created_at: string;
  total_amount: number;
  invoice_number?: string;
  package_title?: string;
}
