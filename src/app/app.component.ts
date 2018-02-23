import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
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
	public showLabel = !1
	public label: string
	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private notifications: NotificationsService,
		private router: Router
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
		this.router.events
		.filter(event => event instanceof NavigationEnd)
		.subscribe((event: NavigationEnd) => {
			this.showLabel = !1
			const link = filter(appsNav, (nav) => nav.link === event.urlAfterRedirects && nav.label)
			link.length === 1 && (this.label = link[0].label, this.showLabel = !0)
		})
	}
}
