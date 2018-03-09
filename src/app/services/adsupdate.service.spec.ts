import { TestBed } from '@angular/core/testing'
import { AdsupdateService } from './adsupdate.service'
import { NotificationsService } from './notifications.service'
import { SasApiClientService } from './sas-api-client.service'
import { SessionDataService } from './session-data.service'
import { Observable } from 'rxjs/Observable'
import { format } from '../public/utils'

describe('AdsUpdateService', () => {
	let adsupdateService: AdsupdateService
	let nsSpy: jasmine.SpyObj<NotificationsService>
	let sasClientSpy: jasmine.SpyObj<SasApiClientService>
	const adIDs = '1,2', placementIDs = '1,2', data = { metadata: { total: 100 }, result: [ {id: 'foo'}, {id: 'bar'} ] }

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AdsupdateService,
				{ provide: NotificationsService, useValue: jasmine.createSpyObj('NotificationsService', ['notify']) },
				{ provide: SasApiClientService, useValue: jasmine.createSpyObj('SasApiClientService', ['getAds', 'updateAds', 'getMultipleResult']) }
			]
		})
		adsupdateService = TestBed.get(AdsupdateService)
		nsSpy = TestBed.get(NotificationsService)
		sasClientSpy = TestBed.get(SasApiClientService)

		const mockObservable = () => Observable.create((observer) => {
			observer.next(data)
			observer.complete()
		})

		sasClientSpy.getAds.and.callFake(mockObservable)
		sasClientSpy.updateAds.and.callFake(mockObservable)
		sasClientSpy.getMultipleResult.and.callFake(mockObservable)
	})

	it('should create the NotificationsService', () => {
		expect(adsupdateService).toBeTruthy()
	})

	describe('(updatebyAdIds)', () => {
		describe('all should complete', () => {
			beforeEach(() => {
				adsupdateService.updatebyAdIds(adIDs)
			})

			it(format('should call getAds method with {0}', adIDs), () => {
				expect(sasClientSpy.getAds).toHaveBeenCalledWith(adIDs)
			})

			it(format('should call updateAds method with {0}', data), () => {
				expect(sasClientSpy.updateAds).toHaveBeenCalledWith({entities: [data]})
			})

			it(format('should call notify method', data), () => {
				expect(nsSpy.notify).toHaveBeenCalled()
			})
		})
	})

	describe('(updatebyPlacements)', () => {
		beforeEach(() => {
			adsupdateService.updatebyPlacements(placementIDs)
		})

		it('should have called the getMultipleResult twice', () => {
			expect(sasClientSpy.getMultipleResult).toHaveBeenCalledTimes(2)
		})

		it('should call the updateAds', () => {
			expect(sasClientSpy.updateAds).toHaveBeenCalledTimes(1)
		})

		it(format('should call notify method', data), () => {
			expect(nsSpy.notify).toHaveBeenCalled()
		})
	})
})
