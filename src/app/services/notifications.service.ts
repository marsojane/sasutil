import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { Subject } from 'rxjs/Subject'
import { AppSideNotificationMessage, ApplicationEvent } from 'sasutil.common'

@Injectable()
export class NotificationsService {
	private _eventMgr: Subject<ApplicationEvent>
	public sideNotifications: AppSideNotificationMessage[] = []
	public sideNotificationTouched: boolean = !1
	constructor(
		private snackBar: MatSnackBar
	) {
		this._eventMgr = new Subject<ApplicationEvent>()
	}
	public notify(type: 'info' | 'error' | 'success', msg: string, showSnackBar?: boolean): void {
		if (!this.sideNotificationTouched) {
			this.sideNotificationTouched = !0
			this.sideNotifications = [{msg, type, timestamp: (new Date).getTime()}]
		} else {
			this.sideNotifications.unshift({msg, type, timestamp: (new Date).getTime()})
		}
		if (showSnackBar) {
			this.snackBar.open(msg, 'close', { duration: 3000 })
		}
		this.notificationsChange()
	}
	public clear(): void {
		this.sideNotificationTouched = !1
		this.sideNotifications = []
		this.notificationsChange()
	}
	public notificationsChange(): void {
		this._eventMgr.next({
			type: 'notificationsChange',
			data: {
				sideNotificationTouched: this.sideNotificationTouched,
				sideNotifications: this.sideNotifications
			}
		})
	}
	public get eventMgr():  Subject<any> {
		return this._eventMgr
	}
}
