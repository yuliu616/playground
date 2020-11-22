export class CollectionUtil {

  /**
   * remove item from the list if it fulfill the predicate.
   */
  static removeFromList<T>(list: T[], predicate: (_:T)=>boolean){
    let revisedList: T[] = list.filter(it=>!predicate(it));
    if (revisedList.length > 0) {
      list.splice(0); //clear
      list.splice(0,0, ...revisedList);
    }
  }

  /**
   * form a new array by taking the first x items 
   * from the list
   * @param list wont be altered
   */
  static takes<T>(list: T[], count: number) {
    if (list.length > count) {
      return list.slice(0, count);
    } else {
      return list;
    }
  }

  /**
   * form a new array by taking the last x items 
   * from the list
   * @param list wont be altered
   */
  static takesLast<T>(list: T[], count: number) {
    if (list.length > count) {
      return list.slice(list.length - count, list.length); 
    } else {
      return list;
    }
  }

  /**
   * loop though all fields of an object, 
   * invoke the provided method for each field value.
   * @param obj field name in string, value in V.
   * @param op field value will be invoked on this method one by one.
   */
  static forEachFields<V extends object>(
    obj: {[name: string]: V}, 
    op: (_:V)=>any,
  ) {
    for (let fieldName in obj) {
      let fieldValue: V = obj[fieldName];
      op(fieldValue);
    }
  }

  /**
   * create a list/array by picking all field values of an object.
   * @param obj field name in string, value in V.
   */
  static propListToList<V extends object>(
    obj: {[name: string]: V}
  ): V[] {
    let list: V[] = [];
    for (let fieldName in obj) {
      let fieldValue: V = obj[fieldName];
      list.push(fieldValue);
    }
    return list;
  }

  /**
   * loop though all fields of an object, 
   * check each of them using the provided predicate,
   * if pass, include the field name in the output list/array.
   * @param obj field name in string, value in V.
   */
  static listFieldNameWhere<V extends object>(
    obj: {[name: string]: V}, 
    predicate: (_:V)=>boolean,
  ): string[] {
    let list: string[] = [];
    for (let fieldName in obj) {
      let fieldValue: V = obj[fieldName];
      if (predicate(fieldValue)) {
        list.push(fieldName);
      }
    }
    return list;
  }

}
