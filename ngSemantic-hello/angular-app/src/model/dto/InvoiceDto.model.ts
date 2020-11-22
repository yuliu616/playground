import { Invoice } from "../Invoice.model";
import { Product } from "../Product.model";

export class InvoiceListDto {

  invoiceList: Invoice[];

  productList: Product[];

}
