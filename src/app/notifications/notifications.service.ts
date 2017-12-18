import { Injectable } from '@angular/core'
import { Notification } from 'apptypes.common'

@Injectable()
export class NotificationsService {
	stackUntouched: boolean = !1
	msgStack: Notification[] = [{type: 'info', msg: 'No notifications for this user session.'}]
	constructor() { }
	public notify(msg: string, isError?: boolean): void {
		!this.stackUntouched && (this.stackUntouched = !0, this.msgStack.shift())
		const notification: Notification = {
			msg,
			type: isError ? 'error' : 'info'
		}
		this.msgStack.unshift(notification)
	}
	public clear(): void {
		this.msgStack = []
	}
}
