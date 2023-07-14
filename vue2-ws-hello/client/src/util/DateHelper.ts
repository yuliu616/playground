import moment from 'moment';

export class DateHelper {

  public static presentDate(value: Date): string {
    if (value) {
      // return moment(value).format(DateFormat.DATE_TIME_LONG);
      return moment(value).format(DateFormat.DATE_ONLY_CHINESE);
    } else {
      return '';
    }
  }

  public static presentDateTime(value: Date): string {
    if (value) {
      // return moment(value).format(DateFormat.DATE_TIME_LONG);
      return moment(value).format(DateFormat.DATE_TIME_WITHOUT_SEC);
    } else {
      return '';
    }
  }

}

export const DateFormat = {
  DATE_TIME_LONG: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_WITHOUT_SEC: 'YYYY-MM-DD HH:mm',
  DATE_ONLY_CHINESE: 'YYYY-MM-DD',
}
