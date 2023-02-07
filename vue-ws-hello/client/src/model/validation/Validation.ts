export const ERROR_REQUIRED_FIELD = 'ERROR_REQUIRED_FIELD';
export const ERROR_INVALID_FORMAT = 'ERROR_INVALID_FORMAT';
export const ERROR_INVALID_VALUE = 'ERROR_INVALID_VALUE';

/**
 * key = field, value = failure object (null if all passed)
 */
 export interface ValidationResult {
  [_:string]: FailureExplanation;
}

export interface FailureExplanation {
  reason: string;
}

export interface ValidationRule {
  name: string;
  validate: (value: any)=>FailureExplanation|null;
}
