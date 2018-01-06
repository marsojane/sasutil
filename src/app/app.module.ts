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

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
	declarations: [
		AppComponent,
		SideNotificationsComponent
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
		MatButtonModule
		// end @angular/material imports
	],
	providers: [
		NotificationsService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
