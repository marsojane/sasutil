import { Injectable } from '@angular/core'
import { AppSideNotificationMessage } from 'sasutil.common'

@Injectable()
export class NotificationsService {
	sideNotifications: AppSideNotificationMessage[] = [{
		msg: 'No notifications for this session',
		type: 'info'
	}]
	sideNotificationTouched: boolean = !1
	constructor() { }
	public notify(type: 'info' | 'error' | 'success', msg: string, showSnackBar?: boolean): void {
		console.log('[NotificationsService] notify()', arguments)
		!this.sideNotificationTouched && (this.sideNotifications = [{msg, type}], this.sideNotificationTouched = !0)
		|| this.sideNotifications.push({
			msg: 'No notifications for this session',
			type: 'info'
		})
	}
	public clear(): void {
		this.sideNotificationTouched = !1
		this.sideNotifications = [{
			msg: 'No notifications for this session',
			type: 'info'
		}]
	}
}
