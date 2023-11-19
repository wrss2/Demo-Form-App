import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class LimitValidator {
  static limitValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value.replace(/\s/g, ''))

      if(isNaN(value)){
        return null
      }

      if (value !== null && (value < min || value > max)) {
        return { limit: true };
      }

      return null;
    };
  }
}
