import { type ValidationRule } from "./validation/Validation";

export interface ModelDef {
  fields: {[_:string]: FieldDef};
}

export interface FieldDef {
  type: 'string' | 'number' | 'boolean' | 'date' | 'dateTime' | 'time' |  'enum';
  required: boolean;
  autoFilled: boolean;
  autoTrim?: boolean;
  rules?: ValidationRule[];
}
