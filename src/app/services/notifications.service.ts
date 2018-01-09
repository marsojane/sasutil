import { Injectable } from '@angular/core'
import { AppSideNotificationMessage } from 'sasutil.common'
import { MatSnackBar } from '@angular/material'

@Injectable()
export class NotificationsService {
	sideNotifications: AppSideNotificationMessage[] = [{
		msg: 'No notifications for this session',
		type: 'info'
	}]
	sideNotificationTouched: boolean = !1
	constructor(
		private snackBar: MatSnackBar
	) { }
	public notify(type: 'info' | 'error' | 'success', msg: string, showSnackBar?: boolean): void {
		// console.log('[NotificationsService] notify()', arguments)
		// console.log('this.sideNotificationTouched', this.sideNotificationTouched)
		// 
		if (!this.sideNotificationTouched) {
			this.sideNotificationTouched = !0
			this.sideNotifications = [{msg, type}]
		} else {
			this.sideNotifications.unshift({msg, type})
		}
		if (showSnackBar) {
			this.snackBar.open(msg, 'close', { duration: 3000 })
		}
	}
	public clear(): void {
		this.sideNotificationTouched = !1
		this.sideNotifications = [{
			msg: 'No notifications for this session',
			type: 'info'
		}]
	}
}
