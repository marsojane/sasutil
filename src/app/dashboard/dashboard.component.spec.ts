import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { DashboardComponent } from './dashboard.component'

import { RouterModule } from '@angular/router'
import { MatImports } from '../app.imports.material'

import { flatten } from 'lodash'

import { SessionDataService } from '../services/session-data.service'
import { NotificationsService } from '../services/notifications.service'
import { MatIconRegistry, MatDialog } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { ElasticAPIClientService } from '../services/elastic-client.service'
import { MsqbClient } from '../services/msqb-api-client.service'
import { SasApiClientService } from '../services/sas-api-client.service'

import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { Subject } from 'rxjs/Subject'
import { asyncData, asyncError } from '../public/async-observable-helpers'

describe('DashboardComponent', () => {
	let component: DashboardComponent
	let fixture: ComponentFixture<DashboardComponent>
	let MatIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>
	let MatDialogSpy: jasmine.SpyObj<MatDialog>
	let DomSanitizerSpy: jasmine.SpyObj<DomSanitizer>
	let NotificationsServiceSpy: jasmine.SpyObj<NotificationsService>
	let SessionDataServiceSpy: jasmine.SpyObj<SessionDataService>
	let ElasticAPIClientServiceSpy: jasmine.SpyObj<ElasticAPIClientService>
	let MsqbClientSpy: jasmine.SpyObj<MsqbClient>
	let SasApiClientServiceSpy: jasmine.SpyObj<SasApiClientService>

	const genStatusChange = (name: string, error?: boolean) => {
		return {
				type: 'connectionStatusChange',
				data: {
					name,
					status: error ? 'noconnection' : 'connected'
			}
		}
	}

	beforeEach(() => {

		const nsSpyObj = {
			eventMgr: new Subject<any>(),
			notify: () => void 0
		}

		ElasticAPIClientServiceSpy = jasmine.createSpyObj<ElasticAPIClientService>('ElasticAPIClientService', ['statusCheck'])
		MsqbClientSpy = jasmine.createSpyObj<MsqbClient>('MsqbClient', ['statusCheck'])
		SasApiClientServiceSpy = jasmine.createSpyObj<SasApiClientService>('SasApiClientService', ['statusCheck'])

		TestBed.configureTestingModule({
			declarations: [ DashboardComponent ],
			imports: flatten([RouterModule, MatImports]),
			providers: [
				{ provide: SessionDataService, useValue: jasmine.createSpyObj('SessionDataService', ['getData']) },
				{ provide: NotificationsService, useValue: nsSpyObj },
				{ provide: MatIconRegistry, useValue: jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']) },
				{ provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']) },
				{ provide: ElasticAPIClientService, useValue: ElasticAPIClientServiceSpy },
				{ provide: MsqbClient, useValue: MsqbClientSpy },
				{ provide: SasApiClientService, useValue: SasApiClientServiceSpy },
				{ provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
			],
			schemas: [ NO_ERRORS_SCHEMA ]
		})
		.overrideComponent(DashboardComponent, {
			set: {
				providers: [
					{ provide: ElasticAPIClientService, useValue: ElasticAPIClientServiceSpy },
					{ provide: MsqbClient, useValue: MsqbClientSpy },
					{ provide: SasApiClientService, useValue: SasApiClientServiceSpy }
				]
			}
		})
		.compileComponents()

		fixture = TestBed.createComponent(DashboardComponent)
		component = fixture.componentInstance

		NotificationsServiceSpy = TestBed.get(NotificationsService)
		SessionDataServiceSpy = TestBed.get(SessionDataService)
		MatIconRegistrySpy = TestBed.get(MatIconRegistry)
		DomSanitizerSpy = TestBed.get(DomSanitizer)
		MatDialogSpy = TestBed.get(MatDialog)

		ElasticAPIClientServiceSpy.statusCheck.and.returnValue(asyncData(genStatusChange('Elastic-Bridge')))
		MsqbClientSpy.statusCheck.and.returnValue(asyncData(genStatusChange('MSSQL-Bridge')))
		SasApiClientServiceSpy.statusCheck.and.returnValue(asyncData(genStatusChange('SAS-API')))
	})

	it('should create DashboardComponent', () => {
		expect(component).toBeDefined()
	})

	it('should call the addSvgIcon 4 times', () => {
		expect(MatIconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(4)
	})

	it('should call the bypassSecurityTrustResourceUrl 4 times', () => {
		expect(DomSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(4)
	})

	it('should define ElasticAPIClientServiceSpy and statusCheck', () => {
		expect(ElasticAPIClientServiceSpy).toBeTruthy()
		expect(ElasticAPIClientServiceSpy.statusCheck).toBeTruthy()
		let statusCheckObs = ElasticAPIClientServiceSpy.statusCheck()
		expect(statusCheckObs instanceof Observable).toBe(true)
	})

	it('should define SasApiClientServiceSpy and statusCheck', () => {
		expect(SasApiClientServiceSpy).toBeTruthy()
		expect(SasApiClientServiceSpy.statusCheck).toBeTruthy()
		let statusCheckObs = SasApiClientServiceSpy.statusCheck()
		expect(statusCheckObs instanceof Observable).toBe(true)
	})

	it('should define MsqbClientSpy and statusCheck', () => {
		expect(MsqbClientSpy).toBeTruthy()
		expect(MsqbClientSpy.statusCheck).toBeTruthy()
		let statusCheckObs = MsqbClientSpy.statusCheck()
		expect(statusCheckObs instanceof Observable).toBe(true)
	})

	describe('(OnInit)', () => {
		beforeEach(fakeAsync(() => {
			SessionDataServiceSpy.getData.and.returnValue('aaa')
			component.ngOnInit()
			tick()
		}))

		it('should run status checks', () => {
			expect(ElasticAPIClientServiceSpy.statusCheck).toHaveBeenCalled()
			expect(MsqbClientSpy.statusCheck).toHaveBeenCalled()
			expect(SasApiClientServiceSpy.statusCheck).toHaveBeenCalled()
		})
	})

	describe('a status change (returned success)', () => {
		beforeEach(fakeAsync(() => {
			ElasticAPIClientServiceSpy.statusCheck.and.returnValue(asyncData(genStatusChange('Elastic-Bridge')))
			component.$notifications.eventMgr
			// .filter((event) => event.type === 'connectionStatusChange')
			.subscribe((event) => {
				const { name, status } = event.data
				component.statusChange(name, status)
			})
			component.statusCheck(ElasticAPIClientServiceSpy, 'Elastic-Bridge')
			tick()
		}))

		it('should have one entry on connections property', () => {
			expect(component.connections.length).toBe(1)
		})

		it('should have a connected status', () => {
			expect(component.connections[0].status).toEqual('connected')
		})
	})

	describe('a status change (returned an error)', () => {
		beforeEach(fakeAsync(() => {
			ElasticAPIClientServiceSpy.statusCheck.and.returnValue(asyncError(genStatusChange('Elastic-Bridge', !0)))
			component.$notifications.eventMgr
			// .filter((event) => event.type === 'connectionStatusChange')
			.subscribe((event) => {
				const { name, status } = event.data
				component.statusChange(name, status)
			})
			component.statusCheck(ElasticAPIClientServiceSpy, 'Elastic-Bridge')
			tick()
		}))

		it('should have one entry on connections property', () => {
			expect(component.connections.length).toBe(1)
		})

		it('should have a noconnection status', () => {
			expect(component.connections[0].status).toEqual('noconnection')
		})
	})

	describe('(genSessionToken)', () => {
		it('should open material dialog', () => {
			component.genSessionToken()
			expect(MatDialogSpy.open).toHaveBeenCalled()
		})
	})
})
