import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../notifications/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { validateNumbersCommaSeparated, validate } from '../validators'
import { SizmekApiClient } from '../api-client/sizmek-api-client'
import { entityTypes } from '../entitytypes'

// rx declarations
// import { Observable } from 'rxjs/Observable'
// import 'rxjs/add/observable/from'
// import 'rxjs/add/operator/concatAll'

@Component({
	selector: 'app-syncentity',
	templateUrl: './syncentity.component.html',
	styleUrls: ['./syncentity.component.css']
})
export class SyncentityComponent implements OnInit {

	entityTypes = entityTypes['sas-sync'] // this is an incomplete list, we need to update this
	entityIDs: string
	entityType: string
	disableSubmit = true
	entityTypeFormCtrl: FormControl
	entityIDsFormCtrl: FormControl

	constructor(
		private notifications: NotificationsService,
		private sizmekApiClient: SizmekApiClient
	) { }
	ngOnInit() {
		this.entityTypeFormCtrl = validate([ Validators.required ])
		this.entityIDsFormCtrl = validate([ Validators.required, validateNumbersCommaSeparated ])

		// this is buggy, if the submit has enabled and added an invalid input, no event is emitted. need to check
		/*
		Observable.from([
			this.entityTypeFormCtrl.valueChanges,
			this.entityIDsFormCtrl.statusChanges
		]).concatAll()
		.subscribe(() => {
			this.shouldDisableSubmit()
		}, (error) => {
			this.shouldDisableSubmit()
		})
		*/
		// workaround, don't combine
		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDsFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.entityTypeFormCtrl.hasError('required')
		|| this.entityIDsFormCtrl.hasError('required')
		|| this.entityIDsFormCtrl.hasError('notNumbersCommaSeparated')
	}

	onSubmit(): void {
		this.sizmekApiClient.syncEntities(this.entityType, this.entityIDs)
		.subscribe((result) => {
			this.notifications.notify(`Sync entities request returned ok.?`)
		}, (error) => {
			this.notifications.notify(error.message, !0)
		})
	}
}
