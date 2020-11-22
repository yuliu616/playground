import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { M2Module } from './m2/m2.module';
import { SayingComponent } from './saying/saying.component';

@NgModule({
  declarations: [
    AppComponent,
    SayingComponent,
  ],
  imports: [
    BrowserModule,
    M2Module,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
