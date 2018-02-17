import { Component, OnInit } from '@angular/core'
import { NotificationsService } from './services/notifications.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'
import { AppSideNotificationMessage } from 'sasutil.common'
import { appsNav } from './data/appsnav'
import { filter } from 'lodash'
import 'rxjs/add/operator/filter'

import { environment } from '../environments/environment'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	public opened = false
	public title = environment.production ? 'Support SASUtil' : 'SASUtil'
	public hasNotifications: boolean
	public appsNav = filter(appsNav, (nav) => nav.enabled)
	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private notifications: NotificationsService
	) {
		iconRegistry.addSvgIcon('notifications-active', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notifications_active.svg'))
		iconRegistry.addSvgIcon('notifications-none', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notifications_none.svg'))
		iconRegistry.addSvgIcon('apps', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/apps.svg'))
	}
	ngOnInit() {
		this.notifications.eventMgr
		.filter((event) => event.type === 'notificationsChange')
		.subscribe((event) => {
			this.hasNotifications = event.data.sideNotificationTouched
		})
	}
}
