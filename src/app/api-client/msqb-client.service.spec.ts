import { TestBed, inject } from '@angular/core/testing'

import { MsqbClient } from './msqb-client.service'

describe('MsqbClientService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
		providers: [MsqbClient]
		})
	})

	it('should be created', inject([MsqbClient], (service: MsqbClient) => {
		expect(service).toBeTruthy()
	}))
})
