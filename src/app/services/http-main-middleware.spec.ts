import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpMainMiddleware } from './http-main-middleware'
import { NotificationsService } from './notifications.service'
import { format } from '../public/utils'

describe('HttpMainMiddleware', () => {
	let httpClient: HttpClient
	let httpTestingController: HttpTestingController
	let httpMiddleware: HttpMainMiddleware
	let req: TestRequest
	let nsSpyObj: jasmine.SpyObj<NotificationsService>
	const testData: { name: string } = { name: 'Test' }, path = '/test'
	beforeEach(() => {
		nsSpyObj = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['notify'])
		httpMiddleware = new HttpMainMiddleware(nsSpyObj)
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			], providers : [
				{ provide: HTTP_INTERCEPTORS, useValue: httpMiddleware, multi: true }
			]
		})

		httpClient = TestBed.get(HttpClient)
		httpTestingController = TestBed.get(HttpTestingController)

		spyOn<HttpMainMiddleware>(httpMiddleware, 'intercept').and.callThrough()
		spyOn<HttpMainMiddleware>(httpMiddleware, 'logRequest').and.callThrough()
	})

	afterEach(() => {
		httpTestingController.verify()
	})

	describe('a request that is NOT svg', () => {
		beforeEach(() => {
			httpClient.get<{ name: string }>(path).subscribe()
			req = httpTestingController.expectOne(path)
			req.flush(testData)
		})

		it('should call the intercept method', () => {
			expect(httpMiddleware.intercept).toHaveBeenCalled()
		})

		it('should call the logRequest method', () => {
			expect(httpMiddleware.logRequest).toHaveBeenCalled()
		})

		it(format('should call the logRequest method with {0},{1}', 'GET', path), () => {
			expect(httpMiddleware.logRequest).toHaveBeenCalledWith(path, 'GET')
		})

		it('should call the ns notify method with info type', () => {
			expect(nsSpyObj.notify.calls.argsFor(0)).toEqual(jasmine.arrayContaining(['info']))
		})
	})

	describe('a request that is svg', () => {
		beforeEach(() => {
			httpClient.get<{ name: string }>('/assets/img.svg').subscribe()
			req = httpTestingController.expectOne('/assets/img.svg')
			req.flush(testData)
		})

		it('should NOT call the ns notify method', () => {
			expect(nsSpyObj.notify).not.toHaveBeenCalled()
		})
	})
})
