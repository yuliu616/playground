export class ArrayUtil {

  /**
   * create an array with target item count.
   * @param item to pushed to the array (all item is the same)
   * @param count 
   * @returns 
   */
  public static createArray<T> (
    item: T, 
    count: number,
  ): T[] {
    let out: T[] = [];
    for (let i=0; i<count ;i++) {
      out.push(item);
    }
    return out;
  }

}
