export class InvoiceItem {

  id?: number;

  version?: number;

  creation_date?: Date;

  last_updated?: Date;

  price?: number;

  quantity?: number;

  product_id?: number; // Product

  invoice_id?: number; // Invoice

}
