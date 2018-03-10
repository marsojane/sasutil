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

describe('AppComponent', () => {
	let component: AppComponent
	let fixture: ComponentFixture<AppComponent>
	let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>
	let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>
	// let nsSpy: jasmine.SpyObj<NotificationsService>
	// let routerSpy: jasmine.SpyObj<Router>
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ AppComponent ],
			imports: flatten([RouterModule, MatImports]),
			providers: [
				{ provide: MatIconRegistry, useValue: jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']) },
				{ provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']) },
				{ provide: NotificationsService, useValue: {} },
				{ provide: Router, useValue: {} }
			],
			schemas: [ NO_ERRORS_SCHEMA ]
		})
		fixture = TestBed.createComponent(AppComponent)
		component = fixture.componentInstance

		matIconRegistrySpy = TestBed.get(MatIconRegistry)
		domSanitizerSpy = TestBed.get(DomSanitizer)
		// nsSpy = TestBed.get(NotificationsService)
		// routerSpy = TestBed.get(Router)
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
})
