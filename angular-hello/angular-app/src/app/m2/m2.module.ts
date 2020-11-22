import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreetingComponent } from './greeting/greeting.component';
import { MaskerPipe } from './masker.pipe';

@NgModule({
  declarations: [
    GreetingComponent, 
    MaskerPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GreetingComponent,
    MaskerPipe,
  ]
})
export class M2Module { }
