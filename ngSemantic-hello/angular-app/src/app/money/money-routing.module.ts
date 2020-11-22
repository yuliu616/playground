import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MoneyHomeComponent } from './money-home/money-home.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

const routes: Routes = [
  {
    path: 'money',
    component: MoneyHomeComponent,
    children: [
      { path: 'invoice-list', component: InvoiceListComponent },
    ]
  },
];

@NgModule({
  declarations: [
    MoneyHomeComponent,
    InvoiceListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class MoneyRoutingModule { }
