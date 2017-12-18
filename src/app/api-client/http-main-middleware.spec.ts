import { TestBed, inject } from '@angular/core/testing'
import { HttpMainMiddlewareService } from './http-main-middleware.service'

describe('HttpMainMiddlewareService', () => {
beforeEach(() => {
	TestBed.configureTestingModule({
		providers: [HttpMainMiddlewareService]
	})
})

	it('should be created', inject([HttpMainMiddlewareService], (service: HttpMainMiddlewareService) => {
		expect(service).toBeTruthy()
	}))
})
