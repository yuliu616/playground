export class NativeDomUtil {

  /**
   * change foreground(color) and background color 
   * of the body tag.
   * @param color 
   */
  static changeBodyForeBackColor(foregroundColor: string, backgroundColor: string) {
    window.document.body.style.color = foregroundColor;
    window.document.body.style.backgroundColor = backgroundColor;
  }

  /**
   * same as "title" tag under "head" tag.
   * @param title 
   */
  static changePageTitle(title: string) {
    window.document.title = title;
  }

}
