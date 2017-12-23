import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ECSEntityInfoComponent } from './ecsentityinfo.component'

describe('EcsentityinfoComponent', () => {
	let component: ECSEntityInfoComponent
	let fixture: ComponentFixture<ECSEntityInfoComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ECSEntityInfoComponent ]
		}).compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(ECSEntityInfoComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
