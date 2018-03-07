import { ElasticAPIClientService } from './elastic-client.service'
import { Observable } from 'rxjs/Observable'
import { format } from '../public/utils'

describe('ElasticAPIClientService', () => {
	const entityId = 987612345, start = 0, end = 9, espath = '/elastic/search/'
	let elasticClient: ElasticAPIClientService
	beforeEach(() => {
		const httpClientSpySub = jasmine.createSpyObj('HttpClient', ['get', 'post'])
		httpClientSpySub.get.and.returnValue(Observable.create())
		httpClientSpySub.post.and.returnValue(Observable.create())
		elasticClient = new ElasticAPIClientService(httpClientSpySub)
		spyOn<ElasticAPIClientService>(elasticClient, 'constructRequest').and.callThrough()
	})

	it('should create an instance of ElasticAPIClientService', () => {
		expect(elasticClient).toBeDefined()
	})

	it('should define the providers property', () => {
		expect(elasticClient.$provider).toBeDefined()
	})

	describe('(getSyncLogs)', () => {
		let syncLogsObs: Observable<any>
		const query = format('{"size":755,"query":{"filtered":{"query":{"query_string":{"query":"_type:WindowsEventLog AND task:10 AND entityID:{0}"}},"filter":{"bool":{"must":[{"range":{"@timestamp":{"gte":{1},"lte":{2}}}}],"must_not":[]}}}}}', entityId, start, end)
		beforeEach(() => {
			// spyOn<ElasticAPIClientService>(elasticClient, 'getSyncLogs').and.callThrough()
			syncLogsObs = elasticClient.getSyncLogs(entityId, start, end)
		})

		it(format('should call constructRequest with arguments {0}, {1}, {2}', entityId, start, end), () => {
			expect(elasticClient.constructRequest).toHaveBeenCalledWith('post', espath, null, JSON.parse(query))
		})

		it('should return an Observable', () => {
			expect(syncLogsObs instanceof Observable)
		})
	})

	describe('(multiSearch)', () => {
		let multiSearchObs: Observable<any>
		const query = format('{"size":100000,"query":{"filtered":{"query":{"query_string":{"query":"{0}"}},"filter":{"bool":{"must":[{"range":{"@timestamp":{"gte":{1},"lte":{2}}}}],"must_not":[]}}}}}', entityId, start, end)
		beforeEach(() => {
			// spyOn<ElasticAPIClientService>(elasticClient, 'multiSearch').and.callThrough()
			multiSearchObs = elasticClient.multiSearch(entityId, start, end)
		})

		it(format('should call constructRequest with arguments {0}, {1}, {2}', entityId, start, end), () => {
			expect(elasticClient.constructRequest).toHaveBeenCalledWith('post', espath, null, JSON.parse(query))
		})

		it('should return an Observable', () => {
			expect(multiSearchObs instanceof Observable)
		})
	})

	describe('(statusCheck)', () => {
		let statusObs: Observable<any>
		const path = '/status'
		beforeEach(() => {
			// spyOn<ElasticAPIClientService>(elasticClient, 'statusCheck').and.callThrough()
			statusObs = elasticClient.statusCheck()
		})

		it(format('should call constructRequest with arguments {0}, {1}', 'get', path), () => {
			expect(elasticClient.constructRequest).toHaveBeenCalledWith('get', path)
		})

		it('should return an Observable', () => {
			expect(statusObs instanceof Observable)
		})
	})
})
