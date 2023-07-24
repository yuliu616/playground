export class StringUtil {

  /**
   * usage: format('i like {0}.', 'eating')
   */
  public static formatString(... args: any[]): string {
    const paramList = args;
    const argCount = args.length;
    let theString = args[0];
  
    // start with the second argument (i = 1)
    for (let i = 1; i < argCount; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        let regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, paramList[i]);
    }
    
    return theString;
  }

}
