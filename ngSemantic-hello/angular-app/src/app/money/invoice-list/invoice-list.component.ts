import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from 'src/model/Invoice.model';
import { Product } from 'src/model/Product.model';
import { InvoiceListDto } from 'src/model/dto/InvoiceDto.model';
import { InvoiceItem } from 'src/model/InvoiceItem.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoiceList: Invoice[];

  productList: Product[];

  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.httpClient.get<InvoiceListDto>('/api/1.0/Invoice')
    .toPromise().then(invoiceListDto=>{
      this.invoiceList = invoiceListDto.invoiceList;
      this.productList = invoiceListDto.productList;
      this.toastrService.info("invoice list ready.", "invoice query");
    });
  }

  presentInvoiceItem(
    invoiceItem: InvoiceItem, 
    productList: Product[],
  ): string {
    for (let p of productList){
      if (p.id == invoiceItem.product_id) {
        if (invoiceItem.quantity > 1) {
          return `${p.name} x ${invoiceItem.quantity}`;
        } else {
          return `${p.name}`;
        }
      }
    }

    if (invoiceItem.quantity > 1) {
      return `item x ${invoiceItem.quantity}`;
    } else {
      return `item`;
    }
  }

}
