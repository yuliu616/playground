import { ModelDef } from "../ModelDef";
import { ERROR_REQUIRED_FIELD, ValidationResult } from "./Validation";
import moment from 'moment';

export class ValidationUtil {

  static debug = false;

  public static validateModel(modelClass: ModelDef, 
    model: any, option: ValidationOption,
  ): ValidationResult|null {

    let errors: ValidationResult = {};
    if (this.debug) {
      console.log(`validateModel beforeCheck:`, model);
    }
    for (let f of Object.keys(modelClass.fields)) {
      let fieldMeta = modelClass.fields[f];
      let v = model[f];

      if (option.autoCorrect) {
        if (fieldMeta.type === 'string' && 
        fieldMeta.autoTrim && typeof v === 'string') {
          model[f] = (<string>v).trim();
          v = model[f];
        } else if (fieldMeta.type === 'date' && typeof v == 'object'){
          if (moment.isMoment(v)) {
            model[f] = (<moment.Moment>v).format('YYYY-MM-DD');
            v = model[f];
          } else if (moment.isDate(v)) {
            model[f] = moment(v).format('YYYY-MM-DD');
            v = model[f];
          }
        }
      }
      
      // check for required
      if (fieldMeta.required) {
        if (fieldMeta.type === 'string' || fieldMeta.type === 'enum') {
          if (!v || v === '') {
            errors[f] = { reason: ERROR_REQUIRED_FIELD };
          }
        } else if (fieldMeta.type === 'number') {
          if (typeof v === 'undefined' || !(v === '0' || +v)) {
            errors[f] = { reason: ERROR_REQUIRED_FIELD };
          }
        } else if (fieldMeta.type !== 'boolean') {
          if (!v) {
            errors[f] = { reason: ERROR_REQUIRED_FIELD };
          }
        }
      }

      // check for rules
      if (!errors[f] && fieldMeta.rules) {
        for (let rule of fieldMeta.rules) {
          let ruleResult = rule.validate(v);
          if (this.debug) {
            console.log(`validateModel field=[${f}], rule=[${rule.name}] result(failure)=`, ruleResult);
          }
          if (ruleResult) {
            errors[f] = ruleResult;
            break;
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return null;
    }
  }

  /**
   * @param expectedType data type of the value (result of "typeof")
   */
  public static isEmptyValueForRule(expectedType: string, value: any,
  ): boolean {
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (expectedType === 'string' && value === '') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * rule is defined to check the value, but sometimes, js allow some really 
   * nonsense value, like NaN and Infinity.
   * for those values, we always reject.
   * @param expectedType data type of the value (result of "typeof")
   */
  public static isNonSenseValueForRule(expectedType: string, value: any,
  ): boolean {
    if (expectedType === 'number' && 
    (Number.isNaN(value) || !Number.isFinite(value))) {
      return true;
    } else {
      return false;
    }
  }

}

interface ValidationOption {

  /**
   * before validation, do some correction logic
   * (make amendment to the data/model),
   * for example, trimming string, converting 
   * Date instance to date string.
   */
  autoCorrect?: boolean;

  action: 'update' | 'create';

}