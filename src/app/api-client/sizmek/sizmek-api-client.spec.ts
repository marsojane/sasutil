import { TestBed, inject } from '@angular/core/testing'

import { SizmekApiClient } from './sizmek-api-client'

describe('SizmeApiClientService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SizmekApiClient]
		})
	})

	it('should be created', inject([SizmekApiClient], (service: SizmekApiClient) => {
		expect(service).toBeTruthy()
	}))
})
