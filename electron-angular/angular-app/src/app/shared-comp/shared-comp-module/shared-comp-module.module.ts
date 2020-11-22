import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { DateOnlyPickerComponent } from '../date-only-picker/date-only-picker.component';

@NgModule({
  declarations: [
    DateOnlyPickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SuiModule,
  ],
  exports: [
    DateOnlyPickerComponent,
  ]
})
export class SharedCompModuleModule { }
