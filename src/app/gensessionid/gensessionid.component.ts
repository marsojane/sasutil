import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormControl, Validators } from '@angular/forms'
import { NotificationsService } from '../services/notifications.service'
import { SessionDataService } from '../services/session-data.service'
import { SasApiClientService } from '../services/sas-api-client.service'
import { format } from '../public/utils'
import { validate } from '../public/validators'
import { SASLoginParams } from 'sasutil.api.sas'

@Component({
	selector: 'app-gensessionid',
	templateUrl: './gensessionid.component.html',
	styleUrls: ['./gensessionid.component.css'],
	providers: [
		SasApiClientService
	]
})
export class GensessionidComponent implements OnInit {

	loginParams: SASLoginParams = { username: '', password: '', sessionId: '' }
	usernameFormCtrl: FormControl
	passwordFormCtrl: FormControl
	disableSubmit: boolean = !1	

	constructor(
		private dialogRef: MatDialogRef<GensessionidComponent>,
		private notifications: NotificationsService,
		private sizmekApiClient: SasApiClientService,
		private sessionData: SessionDataService
	) { }
	ngOnInit() {
		this.usernameFormCtrl = validate('', [ Validators.required ])
		this.passwordFormCtrl = validate('', [ Validators.required ])
		this.loginParams.sessionId = this.sessionData.getData('sessionId') || ''

		this.usernameFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.passwordFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.usernameFormCtrl.hasError('required')
		|| this.passwordFormCtrl.hasError('required')
	}

	onSubmit() {
		this.disableSubmit = !0
		this.dialogRef.close()
		this.sizmekApiClient.login(this.loginParams).subscribe((data) => {
				this.disableSubmit = !1
				this.loginParams.sessionId = data.result.sessionId
				this.sessionData.setData('sessionId', this.loginParams.sessionId)
				this.sessionData.setData('isApiUser', data.result.user.isApiUser)
				this.sessionData.setData('userAccountID', data.result.user.accountId)
				this.notifications.notify('success', format('SessionID successfully generated. SID: {0}', this.loginParams.sessionId))
				this.notifications.eventMgr.next({
					type: 'connectionStatusChange',
					data: {
						name: 'SAS-API',
						status: 'connected'
					}
				})
				this.sizmekApiClient.getAccountSettings(data.result.user.accountId).subscribe((data2) => {
					data2.result 
					&& data2.result.adminSettings 
					&& data2.result.adminSettings.regionalSettings
					&& data2.result.adminSettings.regionalSettings.defaultTimeZone
					&& this.sessionData.setData('userAccountTZ', data2.result.adminSettings.regionalSettings.defaultTimeZone)
				})
			}, (err) => {
				this.disableSubmit = !1
				this.notifications.notify('error', err.message, !0)
		})
	}

}
