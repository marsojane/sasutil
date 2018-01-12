import { FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const validateNumberField = (control: AbstractControl): ValidationErrors | null => {
	return !( control.value * 1 ) ? { 'notNumber': true } : null
}

export const validateNumbersCommaSeparated = (control: AbstractControl): ValidationErrors | null => {
	return !!control.value && !control.value.match('^[0-9,]+$') ? { 'notNumbersCommaSeparated': true } : null
}

export const validDate = (control: AbstractControl): ValidationErrors | null => {
	return !control.value ?  { 'notValidDate': true } : null
}

export const validate = (value: any, validators: ValidatorFn[]): FormControl => {
	return new FormControl(value, validators)
}

// returns true if not valid
export const validateNF = (start, end): boolean => {
	const s = start && start._isValid && start.format('x') || 0, e = end && end._isValid && end.format('x') || 0
	return s === 0 || e === 0 || s >= e || ((e - s) > 2.592e+9)
}
