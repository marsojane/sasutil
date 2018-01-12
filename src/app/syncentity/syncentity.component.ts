import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../services/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { validateNumbersCommaSeparated, validate } from '../public/validators'
import { SasApiClientService } from '../services/sas-api-client.service'
import { entityTypes } from '../data/entitytypes'


@Component({
	selector: 'app-syncentity',
	templateUrl: './syncentity.component.html',
	styleUrls: ['./syncentity.component.css'],
	providers: [
		SasApiClientService
	]
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
		private sasApiClient: SasApiClientService
	) { }

	ngOnInit() {
		this.entityTypeFormCtrl = validate('', [ Validators.required ])
		this.entityIDsFormCtrl = validate('', [ Validators.required, validateNumbersCommaSeparated ])

		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDsFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.entityTypeFormCtrl.hasError('required')
		|| this.entityIDsFormCtrl.hasError('required')
		|| this.entityIDsFormCtrl.hasError('notNumbersCommaSeparated')
	}

	onSubmit(): void {
		this.sasApiClient.syncEntities(this.entityType, this.entityIDs)
		.subscribe((result) => {
			this.notifications.notify('info', 'Request to sync entities successfully sent.')
		}, (error) => {
			this.notifications.notify('error', error.message, !0)
		})
	}

}
