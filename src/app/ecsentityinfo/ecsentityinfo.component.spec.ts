/*
* Writing a shallow test here.
* This needs to be improved when we have time
*/

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'

import { EcsEntityInfoComponent } from './ecsentityinfo.component'
import { NotificationsService } from '../services/notifications.service'
import { MsqbClient } from '../services/msqb-api-client.service'
import { MatImports } from '../app.imports.material'

import { asyncData, asyncError } from '../public/async-observable-helpers'
import { flatten } from 'lodash'

describe('EcsEntityInfoComponent', () => {
	let component: EcsEntityInfoComponent
	let fixture: ComponentFixture<EcsEntityInfoComponent>
	let MsqbClientSpy: jasmine.SpyObj<MsqbClient>
	let NotificationsServiceSpy: jasmine.SpyObj<NotificationsService>

	beforeEach(() => {
		MsqbClientSpy = jasmine.createSpyObj<MsqbClient>('MsqbClient', ['getEntityInfo'])
		NotificationsServiceSpy = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['notify'])

		TestBed.configureTestingModule({
			declarations: [ EcsEntityInfoComponent ],
			imports: flatten([ MatImports, FormsModule, ReactiveFormsModule ]),
			providers: [
				{ provide: NotificationsService, useValue: NotificationsServiceSpy },
				{ provide: MsqbClient, useValue: MsqbClientSpy }
			],
			schemas: [ NO_ERRORS_SCHEMA ]
		})
		.overrideComponent(EcsEntityInfoComponent, {
			set: {
				providers: [
					{ provide: MsqbClient, useValue: MsqbClientSpy },
				]
			}
		})
		.compileComponents()

		fixture = TestBed.createComponent(EcsEntityInfoComponent)
		component = fixture.componentInstance
	})

	it('should create EcsEntityInfoComponent', () => {
		expect(component).toBeDefined()
	})

	describe('(onSubmit)', () => {
		it('should notify the user about the time it will take to pull the data', () => {
			component.selectedPlatform = void 0 // we don't intended to get the data yet
			component.onSubmit()
			expect(NotificationsServiceSpy.notify).toHaveBeenCalled()
		})

		it('should return a completed message', fakeAsync(() => {
			MsqbClientSpy.getEntityInfo.and.returnValue(asyncData({}))
			component.onSubmit()
			tick()
			expect(NotificationsServiceSpy.notify).toHaveBeenCalledTimes(2)
		}))
	})
})
