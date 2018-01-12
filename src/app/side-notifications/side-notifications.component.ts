import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { AppSideNotificationMessage } from 'sasutil.common'
import { NotificationsService } from '../services/notifications.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'
import { exportLogs } from '../public/utils'

@Component({
	selector: 'app-side-notifications',
	templateUrl: './side-notifications.component.html',
	styleUrls: ['./side-notifications.component.css']
})
export class SideNotificationsComponent implements OnInit {
	msgStack: AppSideNotificationMessage[] = []
	@ViewChild('exportlink') exportlink: ElementRef
	constructor(
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private notifications: NotificationsService
	) {
		iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clear.svg'))
		iconRegistry.addSvgIcon('export', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/export.svg'))
	}
	ngOnInit() {
		this.notifications.eventMgr
		.filter((event) => event.type === 'notificationsChange')
		.subscribe((event) => {
			this.msgStack = event.data.sideNotifications
		})
	}
	clear(): void {
		this.notifications.clear()
	}
	export(): void {
		exportLogs(this.exportlink.nativeElement, this.msgStack)
	}
}
