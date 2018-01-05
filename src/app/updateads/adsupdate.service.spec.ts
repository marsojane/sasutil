import { TestBed, inject } from '@angular/core/testing'

import { AdsupdateService } from './adsupdate.service'

describe('AdsupdateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
		providers: [AdsupdateService]
		})
	})

	it('should be created', inject([AdsupdateService], (service: AdsupdateService) => {
		expect(service).toBeTruthy()
	}))
})
