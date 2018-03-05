import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
// app
import { AppRoutingModule } from './app-routing.module'

import { ProvidersImports } from './app.imports.providers'
import { ComponentImports, AppComponent, ESResultDialogComponent, HistoryDialogComponent } from './app.imports.components'
import { MatImports } from './app.imports.material'

import { flatten } from 'lodash'

@NgModule({
	declarations: ComponentImports,
	imports: flatten([
		BrowserModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		MatImports // @angular/material imports
	]),
	entryComponents: [
		ESResultDialogComponent,
		HistoryDialogComponent
	],
	providers: ProvidersImports,
	bootstrap: [ AppComponent ]
})
export class AppModule { }
