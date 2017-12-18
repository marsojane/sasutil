import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SasLoginComponent } from './sas-login.component'

describe('SasLoginComponent', () => {
	let component: SasLoginComponent
	let fixture: ComponentFixture<SasLoginComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SasLoginComponent ]
		})
		.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(SasLoginComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
