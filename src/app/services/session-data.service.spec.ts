import { TestBed } from '@angular/core/testing'
import { SessionDataService } from './session-data.service'
import { format } from '../public/utils'

describe('SessionDataService', () => {
	let ssdataService: SessionDataService
	let storageSpyObj: jasmine.SpyObj<Storage>
	let items: { [index: string]: any } = {}
	beforeEach(() => {
		storageSpyObj = jasmine.createSpyObj<Storage>('Storage', ['getItem', 'setItem'])
		ssdataService = new SessionDataService(storageSpyObj)

		storageSpyObj.getItem.and.callFake((i: string): any | null => {
			return items.hasOwnProperty(i) ? items[i] : null
		})

		storageSpyObj.setItem.and.callFake((i: string, value: any): void => {
			value && (items[i] = value)
		})

		spyOn<SessionDataService>(ssdataService, 'getData').and.callThrough()
		spyOn<SessionDataService>(ssdataService, 'setData').and.callThrough()

		ssdataService.setData('joey', 'cute')
	})

	it(format('should call the storage with {0},{1}', 'joey', 'cute'), () => {
		expect(storageSpyObj.setItem).toHaveBeenCalledWith('joey', 'cute')
	})

	it('should return cute for the item joey', () => {
		const data = ssdataService.getData('joey')
		expect(data).toEqual('cute')
	})
})