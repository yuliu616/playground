import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PeopleCreatorComponent } from './people/people-creator/people-creator.component';
import { SharedCompModuleModule } from './shared-comp/shared-comp-module/shared-comp-module.module';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'people', component: PeopleCreatorComponent },
  // additional path may be defined in other Routing module
];

@NgModule({
  declarations: [
    HomeComponent,
    PeopleCreatorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true}),
    FormsModule,
    SuiModule,
    SharedCompModuleModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
