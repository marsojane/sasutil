import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { Subject } from 'rxjs/Subject'
import { AppSideNotificationMessage, ApplicationEvent, SubscriberFlag } from 'sasutil.common'
import { find, flatten } from 'lodash'
// import { ConnectionsData } from 'sasutil.dashboard'
import { environment } from '../../environments/environment'

@Injectable()
export class NotificationsService {
	private _eventMgr: Subject<ApplicationEvent>
	public sideNotifications: AppSideNotificationMessage[] = []
	public sideNotificationTouched: boolean = !1
	public subscriberFlags: SubscriberFlag[] = []
	// public connections: ConnectionsData[] = []
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

	// Component are re-initialized on user navigation
	// We need to flag subscriptions and filter duplicates
	// this is a bad idea - it seems that the previous subscriptions targets the previously initialized component
	public addSubscriber<C>(name: string, scope: C, subscriber: Function, ...args: any[]): void {
		if (!environment.production) {
			if (!find(this.subscriberFlags, (v) =>
				v.name === name && v.flag
			)) {
				this.subscriberFlags.push({name, flag: !0})
				subscriber.apply(this, flatten([args]))
			}
		} else {
			this.subscriberFlags.push({name, flag: !0})
			subscriber.apply(this, flatten([args]))
		}
	}
}
