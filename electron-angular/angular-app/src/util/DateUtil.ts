import * as moment from 'moment';

export class DateUtil {

  /**
   * create a new Date instance (with local time zone),
   * timed at 00:00:00.
   */
  static today(): Date {
    let date = moment().local()
      .set('millisecond',0).set('second',0).set('minute',0).set('hour',0)
      .toDate();
    return date;
  }

  /**
   * create a new Date instance (with utc),
   * timed at 00:00:00.
   */
  static todayUtc(): Date {
    let date = moment.utc()
      .set('millisecond',0).set('second',0).set('minute',0).set('hour',0)
      .toDate();
    return date;
  }

  /**
   * create a new Date instance (with utc),
   * timed at 00:00:00, in string (ISO).
   * @param outputTimePart if yes, the 'T00:00:00Z' will be included in the return.
   */
  static todayIso(outputTimePart: boolean = false): string {
    let date = moment.utc()
      .set('millisecond',0).set('second',0).set('minute',0).set('hour',0);
    if (outputTimePart) {
      return date.format();
    } else {
      return date.format("YYYY-MM-DD");
    }
  }

  /**
   * convert ISO date, in UTC, to JsDate (UTC) of the same date.
   * (normally, for all time-less date, this method should be invoked  
   * to convert them before picking up in frontend UI/editor)
   * @param dateInIso a time-less date, in UTC (type = string/JsDate).
   */
  static dateOnlyIsoToJsDate(dateInIso: any): Date {
    let input: moment.Moment;
    if (typeof(dateInIso) == 'string') {
      input = moment.utc(dateInIso);
    } else {
      input = moment.utc((<Date>dateInIso).toISOString());
    }
    // console.log('dateOnlyIsoToJsDate:input =', input.format());
    let date = moment.utc({
      year: input.year(),
      month: input.month(),
      date: input.date(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }).toDate();
    return date;
  }

  /**
   * for ISO date, un UTC,to a time part removed version of the same date. 
   * @param dateInIso a time-less date, in UTC (type = string/JsDate).
   */
  static dateOnlyIsoToTimeless(dateInIso: any): string {
    let date: moment.Moment;
    if (typeof(dateInIso) == 'string') {
      date = moment.utc(dateInIso);
    } else {
      date = moment.utc((<Date>dateInIso).toISOString());
    }
    return date.format("YYYY-MM-DD");
  }

  /**
   * convert Js Date, only pick the date part, to a UTC Js Date 
   * of the same date.
   * (normally, for all time-less date, before posting to backend,
   * this method should be invoked)
   * @param dateLessJsDate a time-less date, in local time zone.
   */
  static jsDateToDateOnlyIso(dateLessJsDate: Date): Date {
    let input: moment.Moment;
    input = moment(dateLessJsDate);
    // console.log('jsDateToDateOnlyIso:input =', input.format());
    let date = moment.utc({
      year: input.year(),
      month: input.month(),
      date: input.date(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }).toDate();
    return date;
  }

  /**
   * convert Js Date, only pick the date part, to a DateOnlyStr
   * (iso string without the time part)
   * @param dateLessJsDate a time-less date, in local time zone.
   * @param outputTimePart if yes, the 'T00:00:00Z' will be included in the return.
   */
  static jsDateToDateOnlyStr(dateLessJsDate: Date|null, 
    outputTimePart: boolean = false,): string|null 
  {
    if (!dateLessJsDate) {
      return null;
    }

    let input: moment.Moment;
    input = moment(dateLessJsDate);
    // console.log('jsDateToDateOnlyIso:input =', input.format());
    let date = moment.utc({
      year: input.year(),
      month: input.month(),
      date: input.date(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (outputTimePart) {
      return date.format();
    } else {
      return date.format("YYYY-MM-DD");
    }
  }

}
