import { Component, OnInit, EventEmitter } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import {ErrorStateMatcher} from '@angular/material/core'
import { SASLoginParams } from 'apptypes.api'
import { NotificationsService } from '../../notifications/notifications.service'
import { SizmekApiClient } from '../../api-client/sizmek/sizmek-api-client'
import { SessionDataService } from '../../session-data.service'
import { format } from '../../utils'
import { validate } from '../../validators'

@Component({
	selector: 'app-sas-login',
	templateUrl: './sas-login.component.html',
	styleUrls: ['./sas-login.component.css']
})
export class SasLoginComponent implements OnInit {

	loginParams: SASLoginParams = { username: '', password: '', sessionId: '' }
	usernameFormCtrl: FormControl
	passwordFormCtrl: FormControl
	disableSubmit: boolean = !1

	constructor(
		private notifications: NotificationsService,
		private sizmekApiClient: SizmekApiClient,
		private sessionData: SessionDataService) {}
	ngOnInit() {
		this.usernameFormCtrl = validate([ Validators.required ])
		this.passwordFormCtrl = validate([ Validators.required ])
		this.loginParams.sessionId = this.sessionData.getData('sessionId') || ''
	}

	onSubmit() {
		this.disableSubmit = !0
		this.sizmekApiClient.login(this.loginParams).subscribe((data) => {
				this.disableSubmit = !1
				this.loginParams.sessionId = data.result.sessionId
				this.sessionData.setData('sessionId', this.loginParams.sessionId)
				this.notifications.notify(format('SessionID successfully generated. SID: {0}', this.loginParams.sessionId))
			}, (err) => {
				this.disableSubmit = !1
				this.notifications.notify(err.message, !0)
		})
	}
}
