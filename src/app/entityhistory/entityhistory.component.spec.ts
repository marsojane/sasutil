/*
* This is a pending or an incomplete test. 
* This needs to be improved/created when we have the chance.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TestBed, ComponentFixture } from '@angular/core/testing'

import { EntityHistoryComponent } from './entityhistory.component'
import { MatImports } from '../app.imports.material'
import { SessionDataService } from '../services/session-data.service'
import { NotificationsService } from '../services/notifications.service'
import { MatIconRegistry, MatDialog } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { SasApiClientService } from '../services/sas-api-client.service'

import { flatten } from 'lodash'


describe('EntityHistoryComponent', () => {
	let component: EntityHistoryComponent
	let fixture: ComponentFixture<EntityHistoryComponent>
	let MatIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>
	let MatDialogSpy: jasmine.SpyObj<MatDialog>
	let DomSanitizerSpy: jasmine.SpyObj<DomSanitizer>
	let NotificationsServiceSpy: jasmine.SpyObj<NotificationsService>
	let SessionDataServiceSpy: jasmine.SpyObj<SessionDataService>
	let SasApiClientServiceSpy: jasmine.SpyObj<SasApiClientService>

	beforeEach(() => {

		MatIconRegistrySpy = jasmine.createSpyObj<MatIconRegistry>('MatIconRegistry', ['addSvgIcon'])
		MatDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open'])
		DomSanitizerSpy = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustResourceUrl'])
		NotificationsServiceSpy = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['notify'])
		SessionDataServiceSpy = jasmine.createSpyObj<SessionDataService>('SessionDataService', ['getData'])
		SasApiClientServiceSpy = jasmine.createSpyObj<SasApiClientService>('SasApiClientService', ['getHistory'])


		TestBed.configureTestingModule({
			declarations: [ EntityHistoryComponent ],
			imports: flatten([ MatImports, FormsModule, ReactiveFormsModule ]),
			providers: [
				{ provide: NotificationsService, useValue: NotificationsServiceSpy },
				{ provide: SessionDataService, useValue: SessionDataServiceSpy },
				{ provide: SasApiClientService, useValue: SasApiClientServiceSpy },
				{ provide: MatIconRegistry, useValue: MatIconRegistrySpy },
				{ provide: DomSanitizer, useValue: DomSanitizerSpy },
				{ provide: MatDialog, useValue: MatDialogSpy }
			],
			schemas: [ NO_ERRORS_SCHEMA ]
		})
		.overrideComponent(EntityHistoryComponent, {
			set: {
				providers: [
					{ provide: SasApiClientService, useValue: SasApiClientService }
				]
			}
		})
		.compileComponents()

		fixture = TestBed.createComponent(EntityHistoryComponent)
		component = fixture.componentInstance
	})

	it('should create EntityHistoryComponent', () => {
		expect(component).toBeDefined()
	})
})

