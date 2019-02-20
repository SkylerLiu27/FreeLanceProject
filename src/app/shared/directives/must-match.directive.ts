import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';
import { MustMatch } from '../services/must-match.validator';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[mustMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true }]

})
export class MustMatchDirective {
  @Input('mustMatch') mustMatch: string[] = [];
  constructor() { }
  validate(formGroup: FormGroup): ValidationErrors {
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
