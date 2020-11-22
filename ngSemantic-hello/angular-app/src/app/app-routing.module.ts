import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PeopleRoutingModule } from './people/people-routing.module';
import { MoneyRoutingModule } from './money/money-routing.module';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // additional path may be defined in other Routing module
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true}),
    PeopleRoutingModule,
    MoneyRoutingModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
