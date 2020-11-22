import { InvoiceItem } from './InvoiceItem.model';

export class Invoice {

  id?: number;

  version?: number;

  creation_date?: Date;

  last_updated?: Date;

  invoice_num?: string;

  bill_date?: Date;

  total_amount?: number;

  is_voided?: boolean;

  buyer_id?: number; // People

  shop_id?: number; // Shop

  item?: InvoiceItem[];

}
