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
			expect(loginObs instanceof Observable)
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
			expect(getAdObs instanceof Observable)
		})
	})

	xdescribe('(getAds)', () => {
		// pending
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
			expect(getAdsByPlacementObs instanceof Observable)
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
			expect(getPlacementsByCampaignObs instanceof Observable)
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
			expect(updateAdsObs instanceof Observable)
		})
	})

	describe('(syncEntities)', () => {
		let syncEntitiesObs
		const ids = [adID, adID].join(',')
		const entityType = 'Test'
		const body: any = {
			entities: [{
				ids: ids.split(','),
				entityType: entityType,
				queueNames: ['EDS-Client']
			}]
		}, path = '/replay/syncLastEntities'
		beforeEach(() => {
			syncEntitiesObs = sasApiClientService.syncEntities(entityType, ids)
		})

		it(format('should call construct request with args {0},{1},{2},{3}', 'post', path, token, JSON.stringify(body)), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('post', path, token, body)
		})

		it('should return an Observable', () => {
			expect(syncEntitiesObs instanceof Observable)
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
			expect(statusObs instanceof Observable)
		})
	})

	describe('(getAccountSettings)', () => {
		let getAccountSettingsObs
		const accountID = 2
		const path = format('/accounts/{0}', accountID)
		beforeEach(() => {
			getAccountSettingsObs = sasApiClientService.getAccountSettings(accountID)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAccountSettingsObs instanceof Observable)
		})
	})

	describe('(getHistory)', () => {
		let getAccountSettingsObs
		const id = 2, type = 'Test'
		const path = format('/history/entityhistory?id={0}&type={1}&sort=changedDate&order=desc', id, type)
		beforeEach(() => {
			getAccountSettingsObs = sasApiClientService.getHistory(id, type)
		})

		it(format('should call construct request with {0},{1},{2}', 'get', path, token), () => {
			expect(sasApiClientService.constructRequest).toHaveBeenCalledWith('get', path, sessionDataServiceSpy.getData('sessionID'))
		})

		it('should return an Observable', () => {
			expect(getAccountSettingsObs instanceof Observable)
		})
	})

	xdescribe('(getMultipleResult)', () => {
		// pending
	})

})

