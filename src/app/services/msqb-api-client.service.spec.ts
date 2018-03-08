import { MsqbClient } from './msqb-api-client.service'
import { Observable } from 'rxjs/Observable'
import { format } from '../public/utils'

describe('MsqbClient', () => {
	let type = 1, id = 1, path: string
	let msqbClient: MsqbClient

	beforeEach(() => {
		const httpClientSpySub = jasmine.createSpyObj('HttpClient', ['get', 'post'])
		httpClientSpySub.get.and.returnValue(Observable.create())
		httpClientSpySub.post.and.returnValue(Observable.create())
		msqbClient = new MsqbClient(httpClientSpySub)
		spyOn<MsqbClient>(msqbClient, 'constructRequest').and.callThrough()
	})

	it('should create an instance of MsqbClient', () => {
		expect(msqbClient).toBeDefined()
	})

	it('should define the providers property', () => {
		expect(msqbClient.$provider).toBeDefined()
	})

	describe('(getSyncLogs)', () => {
		let syncLogsObs: Observable<any>
		beforeEach(() => {
			// spyOn<MsqbClient>(msqbClient, 'getSyncLogs').and.callThrough()
			syncLogsObs = msqbClient.getSyncLogs(type, id)
		})

		it(format('should call constructRequest with arguments {0}, {1}', type, id), () => {
			path = format('/synclogs/mdx2/type/{0}/id/{1}', type, id)
			expect(msqbClient.constructRequest).toHaveBeenCalledWith('get', path)
		})

		it('should return an Observable', () => {
			expect(syncLogsObs instanceof Observable).toBe(true)
		})
	})

	describe('(getEntityInfo)', () => {
		let entityInfoObs: Observable<any>
		beforeEach(() => {
			// spyOn<MsqbClient>(msqbClient, 'getEntityInfo').and.callThrough()
			entityInfoObs = msqbClient.getEntityInfo(type, id)
		})

		it(format('should call constructRequest with arguments {0}, {1}', type, id), () => {
			path = format('/entityinfo/platform/sas/type/{0}/id/{1}', type, id)
			expect(msqbClient.constructRequest).toHaveBeenCalledWith('get', path)
		})

		it('should return an Observable', () => {
			expect(entityInfoObs instanceof Observable).toBe(true)
		})
	})

	describe('(statusCheck)', () => {
		let statusObs: Observable<any>
		const statusPath = '/status'
		beforeEach(() => {
			// spyOn<MsqbClient>(msqbClient, 'statusCheck').and.callThrough()
			statusObs = msqbClient.statusCheck()
		})

		it(format('should call constructRequest with arguments {0}, {1}', 'get', statusPath), () => {
			expect(msqbClient.constructRequest).toHaveBeenCalledWith('get', statusPath)
		})

		it('should return an Observable', () => {
			expect(statusObs instanceof Observable).toBe(true)
		})
	})
})
