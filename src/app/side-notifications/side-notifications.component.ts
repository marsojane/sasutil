import { Component, OnInit } from '@angular/core'
import { AppSideNotificationMessage } from 'sasutil.common'
import { NotificationsService } from '../services/notifications.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'

@Component({
	selector: 'app-side-notifications',
	templateUrl: './side-notifications.component.html',
	styleUrls: ['./side-notifications.component.css']
})
export class SideNotificationsComponent implements OnInit {
	msgStack: AppSideNotificationMessage[]
	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private notifications: NotificationsService
	) {
		iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear_white.svg'))
		iconRegistry.addSvgIcon('export', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/export_white.svg'))
	}
	ngOnInit() {
		this.notifications.eventMgr
		.filter((event) => event.type === 'notificationsChange')
		.subscribe((event) => {
			this.msgStack = event.data.sideNotifications
		})
	}
	clearMsgStack(): void {	
		this.notifications.clear()
	}
}
