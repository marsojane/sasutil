import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
// app
import { AppRoutingModule } from './app-routing.module'
// app components
import { AppComponent } from './app.component'
import { SideNotificationsComponent } from './side-notifications/side-notifications.component'
// app services
import { NotificationsService } from './services/notifications.service'
import { SessionDataService } from './services/session-data.service'
import { HttpMainMiddleware } from './services/http-main-middleware'

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { DashboardComponent } from './dashboard/dashboard.component'

@NgModule({
	declarations: [
		AppComponent,
		SideNotificationsComponent,
		DashboardComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		// @angular/material imports
		BrowserAnimationsModule,
		MatToolbarModule,
		MatSidenavModule,
		MatGridListModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule
		// end @angular/material imports
	],
	providers: [
		NotificationsService,
		SessionDataService,
		HttpClient,
		// start of Http Middlewares
		{ provide: HTTP_INTERCEPTORS, useClass: HttpMainMiddleware, multi: true },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
