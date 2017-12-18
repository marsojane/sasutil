import { Component } from '@angular/core'
import { Notification } from 'apptypes.common'
import { NotificationsService } from './notifications/notifications.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private notifications: NotificationsService) {}
	title = 'Support SAS Utility'
	msgStack: Notification[] = this.notifications.msgStack
}
