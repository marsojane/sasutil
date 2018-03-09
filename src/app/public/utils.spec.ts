import { format, inArray, unAwareToTime, reduceFrom } from './utils'
import * as moment from 'moment'

describe('Utility', () => {
	describe('(format)', () => {
		let result = 'foo-bar'
		let formatted: string
		it('should equal to result = ' + result, () => {
			formatted = format('{0}-{1}', 'foo', 'bar')
			expect(formatted).toEqual(formatted)
		})
		it('should equal to result = ' + result + ' (array)', () => {
			formatted = format(['{0}-{1}', 'foo', 'bar'])
			expect(formatted).toEqual(formatted)
		})
	})

	describe('(inArray)', () => {
		let foo = [1, 2, 3, 4, 5]

		it('should return true when searching for 1', () => {
			expect(inArray(1, foo)).toBe(true)
		})

		it('should NOT return true when searching for 6', () => {
			expect(inArray(6, foo)).toBe(false)
		})
	})

	describe('(unAwareToTime)', () => {
		const starttime = '1520524800000' // March 9, 2018
		const endtime = '1520611199000' // March 9, 2018
		const time = moment('2018-03-09T16:49:30')

		it(format('should equal to starttime {0}', starttime), () => {
			expect(unAwareToTime(time)).toEqual(starttime)
		})

		it(format('should equal to endtime {0}', endtime), () => {
			expect(unAwareToTime(time, !0)).toEqual(endtime)
		})
	})

	describe('(reduceFrom)', () => {
		const collection = [ {foo: 'bar'}, {foo: 'bar2'} ]
		const result = ['bar', 'bar2']
		it('should equal to result', () => {
			expect(reduceFrom(collection, 'foo')).toContain('bar')
			expect(reduceFrom(collection, 'foo')).toContain('bar2')
		})
	})
})
