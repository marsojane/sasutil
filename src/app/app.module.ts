import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { HomeComponent } from './home/home.component'

// application services
import { NotificationsService } from './notifications/notifications.service'
import { SessionDataService } from './session-data.service'
import { HttpMainMiddleware } from './api-client/http-main-middleware'
// import { ApiClientService } from './api-client/api-client.service'
import { SizmekApiClient } from './api-client/sizmek-api-client'
import { MsqbClient } from './api-client/msqb-client.service'
import { AdsupdateService } from './updateads/adsupdate.service'

// start @angular/material imports
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
// animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// end @angular material imports

import { SasLoginComponent } from './home/sas-login/sas-login.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { CmqueueComponent } from './cmqueue/cmqueue.component'
import { EntityHistoryComponent } from './entityhistory/entityhistory.component'
import { ECSEntityInfoComponent } from './ecsentityinfo/ecsentityinfo.component'
import { UpdateadsComponent } from './updateads/updateads.component'
import { SyncentityComponent } from './syncentity/syncentity.component'

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SasLoginComponent,
		NotificationsComponent,
		CmqueueComponent,
		EntityHistoryComponent,
		ECSEntityInfoComponent,
		UpdateadsComponent,
		SyncentityComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		// @angular/material imports
		BrowserAnimationsModule,
		MatToolbarModule,
		MatMenuModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSidenavModule,
		MatButtonToggleModule,
		MatSelectModule,
		MatTableModule,
		MatTabsModule
		// end @angular/material imports
	],
	providers: [
		NotificationsService,
		SessionDataService,
		HttpClient,
		// start of Http Middlewares
		{ provide: HTTP_INTERCEPTORS, useClass: HttpMainMiddleware, multi: true },
		// ApiClientService,
		SizmekApiClient,
		MsqbClient,
		// end of Http Middlewares
		AdsupdateService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
