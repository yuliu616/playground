import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

/**
 * for value that must be within the pre-defined set of 
 * valid values (like enum).
 */
export class ValidValueSetRule implements ValidationRule {

  name = 'ValidValueSetRule';

  constructor(private allPossibleValues: any[],
    private errorCode: string = ERROR_INVALID_VALUE,
  ) {
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule(typeof this.allPossibleValues[0], value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule(typeof this.allPossibleValues[0], value)) {
      return { reason: this.errorCode };
    }
    
    for (let v of this.allPossibleValues) {
      if (value === v) {
        return null;
      }
    }
    return { reason: this.errorCode };
  }

}
