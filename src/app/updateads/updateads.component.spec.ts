import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpdateadsComponent } from './updateads.component'

describe('UpdateadsComponent', () => {
	let component: UpdateadsComponent
	let fixture: ComponentFixture<UpdateadsComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
		declarations: [ UpdateadsComponent ]
		})
		.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateadsComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
