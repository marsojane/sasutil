import { Component, OnInit, Input } from '@angular/core'
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
	@Input() msgStack: AppSideNotificationMessage[]
	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private notifications: NotificationsService
	) {
		iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear.svg'))
		iconRegistry.addSvgIcon('export', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/export.svg'))
	}
	ngOnInit() {
		this.msgStack = this.notifications.sideNotifications
	}
	clearMsgStack(): void {	
		// this actually doesn't work
		this.notifications.clear()
	}
}
