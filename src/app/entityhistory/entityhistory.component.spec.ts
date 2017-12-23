import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EntityHistoryComponent } from './entityhistory.component'

describe('EntityhistoryComponent', () => {
	let component: EntityHistoryComponent
	let fixture: ComponentFixture<EntityHistoryComponent>

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ EntityHistoryComponent ]
		})
		.compileComponents()
	}))

	beforeEach(() => {
		fixture = TestBed.createComponent(EntityHistoryComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
