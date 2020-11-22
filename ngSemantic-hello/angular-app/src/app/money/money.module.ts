import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyHomeComponent } from './money-home/money-home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { MoneyRoutingModule } from './money-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

@NgModule({
  declarations: [
    // MoneyHomeComponent,
    InvoiceListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SuiModule,
    MoneyRoutingModule,
  ]
})
export class MoneyModule { }
