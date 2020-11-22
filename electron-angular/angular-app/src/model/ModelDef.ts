export interface ModelDef {
  name: string,
  className?: string,
  tableName?: string,
  description?: string;
  fields: {[name: string]: FieldDef},
}

class FieldDef {

  type: DataType = "string";

  isId?: boolean = false;

  /**
   * for association between model classes,
   * model class of the counter party.
   */
  modelType?: string;

  /**
   * (for association only)
   * one-to-many relationship (therefore it become a list/array field).
   */
  isList?: boolean = false;

  /**
   * full path of the `modelType` exclude the type itself.
   * for example, for `src/model/money/Product`, the namespace will be `money`.
   */
  modelNameSpace?: string;

  /**
   * for association between model classes,
   * which field in this class is storing 
   * the id field of that class.
   */
  byLinkField?: string;

  /**
   * for association between model classes,
   * and the reference field is stored in the target class,
   * which field of it storing the id field of this class.
   */
  byInverseLinkField?: string;

  /**
   * used in validation.
   * (not exactly same as the concept "is nullable")
   * (if a field is autoFilled, then, required=false)
   */
  required?: boolean = false;

  /**
   * if yes, the fields will be filled by system
   * (instead of provided by user input)
   */
  autoFilled?: boolean = false;

  description?: string;

}

type DataType = "number" | "boolean" | "string" | "Date" | "model" | "foreignKey";
