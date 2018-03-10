import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TestBed, ComponentFixture } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { flatten } from 'lodash'
// providers
import { RouterModule } from '@angular/router'
import { MatIconRegistry } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { NotificationsService } from './services/notifications.service'
import { Router } from '@angular/router'
// import { AppRoutingModule } from './app-routing.module'
import { MatImports } from './app.imports.material'
import { of } from 'rxjs/observable/of'

describe('AppComponent', () => {
	let component: AppComponent
	let fixture: ComponentFixture<AppComponent>
	let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>
	let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>
	// let notificationsService: NotificationsService
	// let router: Router
	let notificationsService: any
	let router: any
	beforeEach(() => {
		const nsSpyObj = {
			eventMgr: {
				subscribe: () => of({type: 'notificationsChange', data: {sideNotificationTouched : true}}),
				filter: () => of({type: 'notificationsChange', data: {sideNotificationTouched : true}})
			}
		}
		const routerSpyObj = {
			events: {
				subscribe: () => of({urlAfterRedirects: '/test'}),
				filter: () => of({urlAfterRedirects: '/test'})
			}
		}
		TestBed.configureTestingModule({
			declarations: [ AppComponent ],
			imports: flatten([RouterModule, MatImports]),
			providers: [
				{ provide: MatIconRegistry, useValue: jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']) },
				{ provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']) },
				{ provide: NotificationsService, useValue: nsSpyObj },
				{ provide: Router, useValue: routerSpyObj }
			],
			schemas: [ NO_ERRORS_SCHEMA ]
		})
		fixture = TestBed.createComponent(AppComponent)
		component = fixture.componentInstance

		matIconRegistrySpy = TestBed.get(MatIconRegistry)
		domSanitizerSpy = TestBed.get(DomSanitizer)
		notificationsService = TestBed.get(NotificationsService)
		router = TestBed.get(Router)
		spyOn<Subject<any>>(notificationsService.eventMgr, 'subscribe')
		spyOn<Observable<any>>(router.events, 'subscribe')
		// start the OnInit cycle
		component.ngOnInit()
	})

	it('should create AppComponent', () => {
		expect(component).toBeDefined()
	})

	it('should call the addSvgIcon method thrice', () => {
		expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(3)
	})

	it('should call the bypassSecurityTrustResourceUrl method thrice', () => {
		expect(domSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(3)
	})

	// we need to check why jasmine was not able to spy these methods
	// it seems that nesting a method inside a property doesn't seem to work properly
	// also creating a spyObj with a method inside a property (spyObj('name',prop1: { method1: () => {} })) doesn't seem to work
	xit('should subscribe to the [NotificationsService] eventMgr', () => {
		expect(notificationsService.eventMgr.subscribe).toHaveBeenCalled()
	})

	xit('should subscribe to the [Router] events', () => {
		expect(router.events.subscribe).toHaveBeenCalled()
	})
})
