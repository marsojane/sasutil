import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
// app
import { AppRoutingModule } from './app-routing.module'
import { ComponentImports } from './app.imports.components'
import { ProvidersImports } from './app.imports.providers'
import { MatImports } from './app.imports.material'

import { Router } from '@angular/router'
import { NotificationsService } from './services/notifications.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'

import { flatten } from 'lodash'

xdescribe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AppComponent ],
			providers: [
				MatIconRegistry,
				DomSanitizer,
				NotificationsService
			]
		}).compileComponents()
	}))
	xit('should create the app', async(() => {
		// const fixture = TestBed.createComponent(AppComponent)
		// const app = fixture.debugElement.componentInstance
		// expect(app).toBeTruthy()
	}))
})
