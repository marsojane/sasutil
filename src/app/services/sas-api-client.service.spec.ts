import { SasApiClientService } from './sas-api-client.service'
import { SessionDataService } from './session-data.service'
import { Observable } from 'rxjs/Observable'
import { format } from '../public/utils'

describe('SasApiClientService', () => {
	let sasApiClientService: SasApiClientService
	let sessionDataServiceSpy: jasmine.SpyObj<SessionDataService>
	let httpClientSpy: jasmine.SpyObj<any>
	const token = 'aaaaa-bbbbb-ccccc-ddddd-eeeee'
	const adID = 987651234, placementID = 987651234, campaignID = 987651234
	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put'])
		sessionDataServiceSpy = jasmine.createSpyObj('SessionDataService', ['getData'])
		httpClientSpy.get.and.returnValue(Observable.create())
		httpClientSpy.post.and.returnValue(Observable.create())
		httpClientSpy.put.and.returnValue(Observable.create())
		sasApiClientService = new SasApiClientService(httpClientSpy, sessionDataServiceSpy)
		spyOn<SasApiClientService>(sasApiClientService, 'constructRequest').and.callThrough()
		sessionDataServiceSpy.getData.and.callFake((item: string): any => {
			return token
		})
	})

	it('should create an instance of MsqbClient', () => {
		expect(sasApiClientService).toBeDefined()
	})

	it('should define the providers property', () => {
		expect(sasApiClientService.$provider).toBeDefined()
	})

	describe('(login)', () => {
		let loginObs
		const loginParams = {username: 'guest', password: 'guest'}, path = '/login/login'
		beforeEach(() => {
			loginObs = sasApiClientService.login(loginParams)
		})

		it(format('should call construct request with args {0},{1},{2},{3}', 'post', path, null, JSON.stringify(loginParams)), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('post', path, null, loginParams)
		})

		it('should return an Observable', () => {
			expect(loginObs instanceof Observable).toBe(true)
		})
	})

	describe('(getAd)', () => {
		let getAdObs
		const path = format('/ads/{0}', adID)
		beforeEach(() => {
			getAdObs = sasApiClientService.getAd(adID)
		})

		it(format('should call construct request with args {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAdObs instanceof Observable).toBe(true)
		})
	})

	describe('(getAds)', () => {
		let getAdsObs: Observable<any>
		const adids = [1, 2].join(',')
		beforeEach(() => {
			spyOn<SasApiClientService>(sasApiClientService, 'getAd').and.returnValue(Observable.create((observer) => {
				observer.next({})
				observer.complete()
			}))
			getAdsObs = sasApiClientService.getAds(adids)
			getAdsObs.subscribe()
		})

		it('should call the getAd method twice', () => {
			expect(sasApiClientService.getAd).toHaveBeenCalledTimes(2)
		})

		it(format('should call the getAd method with {0}', adids), () => {
			expect(sasApiClientService.getAd).toHaveBeenCalledWith(1)
			expect(sasApiClientService.getAd).toHaveBeenCalledWith(2)
		})

		it('should return an Observable', () => {
			expect(getAdsObs instanceof Observable).toBe(true)
		})
	})

	describe('(getAdsByPlacement)', () => {
		let getAdsByPlacementObs
		const from = 0, max = 10
		const path = format('/ads?placementId={0}&from={1}&max={2}', placementID, from, max)
		beforeEach(() => {
			getAdsByPlacementObs = sasApiClientService.getAdsByPlacement(placementID, 0, 10)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAdsByPlacementObs instanceof Observable).toBe(true)
		})
	})

	describe('(getPlacementsByCampaign)', () => {
		let getPlacementsByCampaignObs
		const from = 0, max = 10
		const path = format('/placements?campaignId={0}&from={1}&max={2}&order=asc&sort=name', campaignID, from, max)
		beforeEach(() => {
			getPlacementsByCampaignObs = sasApiClientService.getPlacementsByCampaign(campaignID, 0, 10)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getPlacementsByCampaignObs instanceof Observable).toBe(true)
		})
	})

	describe('(updateAds)', () => {
		let updateAdsObs
		const reqBody = { foo: 'bar' }, path = '/ads'
		beforeEach(() => {
			updateAdsObs = sasApiClientService.updateAds(reqBody)
		})

		it(format('should call construct request with args {0},{1},{2},{3}', 'put', path, token, JSON.stringify(reqBody)), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('put', path, sessionDataServiceSpy.getData('sessionID'), reqBody)
		})

		it('should return an Observable', () => {
			expect(updateAdsObs instanceof Observable).toBe(true)
		})
	})

	describe('(syncEntities)', () => {
		let syncEntitiesObs
		const adids = [adID, adID].join(',')
		const entityType = 'Test'
		const body: any = {
			entities: [{
				ids: adids.split(','),
				entityType: entityType,
				queueNames: ['EDS-Client']
			}]
		}, path = '/replay/syncLastEntities'
		beforeEach(() => {
			syncEntitiesObs = sasApiClientService.syncEntities(entityType, adids)
		})

		it(format('should call construct request with args {0},{1},{2},{3}', 'post', path, token, JSON.stringify(body)), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('post', path, token, body)
		})

		it('should return an Observable', () => {
			expect(syncEntitiesObs instanceof Observable).toBe(true)
		})
	})

	describe('(statusCheck)', () => {
		let statusObs: Observable<any>
		const path = '/login/tokens/check'
		beforeEach(() => {
			statusObs = sasApiClientService.statusCheck()
		})

		it(format('should call constructRequest with arguments {0}, {1}, {2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(statusObs instanceof Observable).toBe(true)
		})
	})

	describe('(getAccountSettings)', () => {
		let getAccountSettingsObs: Observable<any>
		const accountID = 2
		const path = format('/accounts/{0}', accountID)
		beforeEach(() => {
			getAccountSettingsObs = sasApiClientService.getAccountSettings(accountID)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAccountSettingsObs instanceof Observable).toBe(true)
		})
	})

	describe('(getHistory)', () => {
		let getAccountSettingsObs: Observable<any>
		const id = 2, type = 'Test'
		const path = format('/history/entityhistory?id={0}&type={1}&sort=changedDate&order=desc', id, type)
		beforeEach(() => {
			getAccountSettingsObs = sasApiClientService.getHistory(id, type)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAccountSettingsObs instanceof Observable).toBe(true)
		})
	})

	describe('(getMultipleResult)', () => {
		let getMultipleResultObs: Observable<any>

		beforeEach(() => {
			spyOn<SasApiClientService>(sasApiClientService, 'getAdsByPlacement').and.callFake((pid: number) => {
				return Observable.create((observer) => {
					const data = {
						metadata: { total: 11 },
						result: [ {foo: 'bar'} ]
					}
					observer.next(data), observer.complete()
				})
			})
			getMultipleResultObs = sasApiClientService.getMultipleResult(sasApiClientService.getAdsByPlacement, placementID)
			getMultipleResultObs.subscribe()
		})

		it('should call the getAdsByPlacement twice', () => {
			expect(sasApiClientService.getAdsByPlacement).toHaveBeenCalledTimes(2)
		})

		it(format('should call getAdsByPlacement method with {0},{1},{2}', placementID, 0, 10), () => {
			expect(sasApiClientService.getAdsByPlacement).toHaveBeenCalledWith(placementID, 0, 10)
		})

		it(format('should call getAdsByPlacement method with {0},{1},{2}', placementID, 10, 10), () => {
			expect(sasApiClientService.getAdsByPlacement).toHaveBeenCalledWith(placementID, 10, 10)
		})

		it('should return an Observable', () => {
			expect(getMultipleResultObs instanceof Observable).toBe(true)
		})

	})

})

