// import { TestBed } from '@angular/core/testing'
import { APIClient } from './apiclient'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { format } from '../public/utils'

describe('APIClient', () => {
	const sessionToken = 'aaa-bbb-ccc-ddd-eee'
	let apiClient: APIClient, httpClientSpy: jasmine.SpyObj<HttpClient>

	beforeEach(() => {
		const httpClientSpySub = jasmine.createSpyObj('HttpClient', ['get', 'post'])
		httpClientSpySub.get.and.returnValue(Observable.create())
		httpClientSpySub.post.and.returnValue(Observable.create())
		apiClient = new APIClient(httpClientSpySub)
		spyOn<APIClient>(apiClient, 'constructRequest').and.callThrough()
		spyOn<APIClient>(apiClient, 'getReqHeaders').and.callThrough()
	})

	it('should create the APIClient', () => {
		expect(apiClient).toBeTruthy()
	})

	it('should have content-type on the headers', () => {
		const headers = apiClient.getReqHeaders()
		expect(headers).toEqual(jasmine.objectContaining({ 'content-type': 'application/json' }))
	})

	it('should have Authorization on the headers equal to ' + sessionToken, () => {
		const headers = apiClient.getReqHeaders(sessionToken)
		expect(headers).toEqual(jasmine.objectContaining({ 'Authorization': sessionToken }))
	})

	it('should return constructed URL', () => {
		spyOn<APIClient>(apiClient, 'getReqURL').and.callThrough()
		apiClient.$provider = {
			'base': 'http://jp6rt.io',
			'reqHeaders': {
				'content-type': 'application/json'
			}
		}
		let result = format('{0}{1}', 'http://jp6rt.io', '/test')
		let reqURL = apiClient.getReqURL('/test')
		expect(reqURL).toEqual(result)
	})

	describe('GET request w/o SessionID', () => {
		let httpClient: Observable<any>
		beforeEach(() => {
			spyOn<APIClient>(apiClient, 'getReqURL').and.stub()
			httpClient = apiClient.constructRequest('get', '/test')
		})

		it('should call the constructRequest method', () => {
			expect(apiClient.constructRequest).toHaveBeenCalled()
		})

		it('constructRequest should return an Observable', () => {
			expect(httpClient instanceof Observable).toBe(true)
		})

		it('should call the getReqURL method with \'test\'', () => {
			expect(apiClient.getReqURL).toHaveBeenCalledWith('/test')
		})

		it('should call the getReqHeaders method with undefined', () => {
			expect(apiClient.getReqHeaders).toHaveBeenCalledWith(undefined)
		})
	})

	describe('POST request w/ SessionID', () => {
		let httpClient: Observable<any>

		beforeEach(() => {
			spyOn<APIClient>(apiClient, 'getReqURL').and.stub()
			httpClient = apiClient.constructRequest('post', '/test', sessionToken, { foo: 'bar' })
		})

		it('should call the constructRequest method', () => {
			expect(apiClient.constructRequest).toHaveBeenCalled()
		})

		it('constructRequest should return an Observable', () => {
			expect(httpClient instanceof Observable).toBe(true)
		})

		it('should call the getReqURL method with \'test\'', () => {
			expect(apiClient.getReqURL).toHaveBeenCalledWith('/test')
		})

		it('should call the getReqHeaders method with ' + sessionToken, () => {
			expect(apiClient.getReqHeaders).toHaveBeenCalledWith(sessionToken)
		})
	})

})
