import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DateUtil } from 'src/util/DateUtil';

@Component({
  selector: 'date-only-picker',
  templateUrl: './date-only-picker.component.html',
  styleUrls: ['./date-only-picker.component.css']
})
export class DateOnlyPickerComponent implements OnInit, OnChanges {

  /**
   * a date-only value (without time part) stored as string 
   * using ISO format (example: '2018-10-25T00:00:00.000Z').
   * Since it is time-less, we will always use UTC for it.
   */
  @Input()
  dateInIso?: string;

  @Input()
  clearButton: boolean = false;

  @Output()
  dateInIsoChange = new EventEmitter<string>();

  // internal version of the date
  date: Date;

  dateFormat = "yyyy-MM-dd";

  constructor(
  ) { 
  }

  ngOnInit() {
  }

  /**
   * on changes of input param
   */
  ngOnChanges(changes: SimpleChanges){
    if (changes.dateInIso && changes.dateInIso.currentValue) {
      this.date = DateUtil.dateOnlyIsoToJsDate(changes.dateInIso.currentValue);
    } else {
      this.date = null;
    }
  }

  onDateChangedInPicker(date: Date){
    if (!date){
      // console.log(`onDateChangedInPicker with nothing, ignore it.`);
      return;
    }

    let converted: string = DateUtil.jsDateToDateOnlyStr(date, true);
    // console.log(`onDateChangedInPicker: `, date, `, converted: `, converted);
    this.dateInIso = converted;
    this.dateInIsoChange.emit(this.dateInIso);
  }

  clearValue(){
    this.dateInIso = null;
    this.date = null;
    this.dateInIsoChange.emit(this.dateInIso);
  }

}
