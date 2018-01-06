import { Component, OnInit } from '@angular/core'
import { NotificationsService } from './services/notifications.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'
import { AppSideNotificationMessage } from 'sasutil.common'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {	
	public title = 'Support SAS Helper'
	public hasNotifications: boolean
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
		this.hasNotifications = this.notifications.sideNotificationTouched
	}
}
