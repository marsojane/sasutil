import { FormControl, Validators } from '@angular/forms'
import { validateNumberField , validateNumbersCommaSeparated, validDate, validate, validateNF } from './validators'
import * as moment from 'moment'

describe('Validators', () => {
	describe('(validateNumberField)', () => {
		const errorResult = { 'notNumber': true }
		it('should return an error', () => {
			expect(validateNumberField({ value: 'a' })).toEqual(errorResult)
		})

		it('should NOT return an error', () => {
			expect(validateNumberField({ value: '1' })).toBeNull()
			expect(validateNumberField({ value: 1 })).toBeNull()
		})
	})

	describe('(validateNumbersCommaSeparated)', () => {
		const errorResult = { 'notNumbersCommaSeparated': true }

		it('should return an error', () => {
			expect(validateNumbersCommaSeparated({ value: '1,2,c' })).toEqual(errorResult)
		})

		it('should NOT return an error', () => {
			expect(validateNumbersCommaSeparated({ value: '1,2,3' })).toBeNull()
		})
	})

	describe('(validDate)', () => {
		const errorResult = { 'notValidDate': true }

		it('should return an error', () => {
			expect(validDate({ value: null })).toEqual(errorResult)
		})

		it('should NOT return an error', () => {
			expect(validDate({ value: 'foo' })).toBeNull()
		})
	})

	describe('(validate)', () => {
		it('should return an instance of FormControl', () => {
			const formControl = validate('', [ Validators.required ])
			expect(formControl instanceof FormControl).toBe(true)
		})
	})

	describe('(validateNF)', () => {
		const maxms = 2.592e+8 // 3 days
		let start: moment.Moment
		let end: moment.Moment

		it('should return a valid date range', () => {
			start = moment('2018-03-09T16:49:30')
			end = moment('2018-03-11T16:49:30')
			expect(validateNF(start, end, maxms)).toBe(false)
		})

		it('should NOT return a valid date range', () => {
			start = moment('2018-03-09T16:49:30')
			end = moment('2018-03-12T16:49:30')
			expect(validateNF(start, end, maxms)).toBe(true)
		})
	})
})
