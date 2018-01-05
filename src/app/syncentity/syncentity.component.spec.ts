import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SyncentityComponent } from './syncentity.component'

describe('SyncentityComponent', () => {
	let component: SyncentityComponent
	let fixture: ComponentFixture<SyncentityComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
		declarations: [ SyncentityComponent ]
		})
		.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(SyncentityComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
