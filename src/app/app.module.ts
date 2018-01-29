import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
// app
import { AppRoutingModule } from './app-routing.module'
// app components
import { AppComponent } from './app.component'
import { SideNotificationsComponent } from './sidenotifications/side-notifications.component'
// app services
import { NotificationsService } from './services/notifications.service'
import { SessionDataService } from './services/session-data.service'
import { HttpMainMiddleware } from './services/http-main-middleware'
// app components
import { DashboardComponent } from './dashboard/dashboard.component'
import { GensessionidComponent } from './gensessionid/gensessionid.component'
import { SyncentityComponent } from './syncentity/syncentity.component'
import { UpdateadsComponent } from './updateads/updateads.component'
import { EcsEntityInfoComponent } from './ecsentityinfo/ecsentityinfo.component'
import { SynclogsComponent } from './synclogs/synclogs.component'
import { ESMSearchComponent } from './esmsearch/esmsearch.component'
import { ESResultDialogComponent } from './esresdialog/esresdialog.component'
import { EntityHistoryComponent } from './entityhistory/entityhistory.component'

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatListModule } from '@angular/material/list'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDialogModule } from '@angular/material/dialog'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatDividerModule } from '@angular/material/divider'

@NgModule({
	declarations: [
		AppComponent,
		SideNotificationsComponent,
		DashboardComponent,
		GensessionidComponent,
		SyncentityComponent,
		UpdateadsComponent,
		EcsEntityInfoComponent,
		SynclogsComponent,
		ESMSearchComponent,
		ESResultDialogComponent,
		EntityHistoryComponent
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
		MatSidenavModule,
		MatGridListModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonToggleModule,
		MatSelectModule,
		MatTableModule,
		MatTabsModule,
		MatListModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatExpansionModule,
		MatDialogModule,
		MatPaginatorModule,
		MatDividerModule
		// end @angular/material imports
	],
	entryComponents: [
		ESResultDialogComponent
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
