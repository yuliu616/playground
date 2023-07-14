import { 
  ERROR_INVALID_FORMAT,
  FailureExplanation,
  ValidationRule 
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class RegExpTextRule implements ValidationRule {

  name = 'RegExpTextRule';
  
  constructor(private pattern: RegExp, 
    private errorCode: string = ERROR_INVALID_FORMAT,
  ) {
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule('string', value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule('string', value)) {
      return { reason: this.errorCode };
    }

    if (!this.pattern.test(value)) {
      return { reason: this.errorCode };
    } else {
      return null;
    }
  }

}
