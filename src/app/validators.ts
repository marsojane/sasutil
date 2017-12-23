import { FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const validateNumberField = (control: AbstractControl): ValidationErrors | null => {
	return !( control.value * 1 ) ? { 'notNumber': true } : null
}

export const validate = (validators: ValidatorFn[]): FormControl => {
	return new FormControl('', validators )
}
