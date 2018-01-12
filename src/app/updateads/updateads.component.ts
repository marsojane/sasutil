import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { validate, validateNumberField, validateNumbersCommaSeparated } from '../public/validators'
import { NotificationsService } from '../services/notifications.service'
import { SasApiClientService } from '../services/sas-api-client.service'
import { AdsupdateService } from '../services/adsupdate.service'

@Component({
	selector: 'app-updateads',
	templateUrl: './updateads.component.html',
	styleUrls: ['./updateads.component.css'],
	providers: [
		SasApiClientService, 
		AdsupdateService
	]
})
export class UpdateadsComponent implements OnInit {

	entityTypes = [
		{ value: 'Campaign', viewValue: 'Campaign' },
		{ value: 'Placement', viewValue: 'Placement' },
		{ value: 'Ad', viewValue: 'Ad' }
	]

	txtAreaplaceHolder = {
		Campaign: 'Enter Campaign ID (only one entity is supported)',
		Placement: 'Enter Placement ID(s) (separated by comma)',
		Ad: 'Enter Ad ID(s) (separated by comma)'
	}

	private _selectedEntityType: string
	entityIDs: string
	entityIDsValidationMessage: string

	entityTypeFormCtrl: FormControl
	entityIDsFormCtrl: FormControl
	disableSubmit = true

	constructor(
		private adsupdate: AdsupdateService, private notifications: NotificationsService
	) { }

	ngOnInit() {
		this.entityTypeFormCtrl = validate('', [ Validators.required ])
		this.entityIDsFormCtrl = validate('', [ Validators.required, validateNumbersCommaSeparated, validateNumberField ])

		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDsFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		// for now we only support placemnet type
		this.disableSubmit = (this.entityTypeFormCtrl.hasError('required')
		|| this.entityIDsFormCtrl.hasError('required')
		|| (this._selectedEntityType !== 'Campaign' && this.entityIDsFormCtrl.hasError('notNumbersCommaSeparated'))
		|| (this._selectedEntityType === 'Campaign' && this.entityIDsFormCtrl.hasError('notNumber'))
		)

		// react to changes and change the validation message
		this.entityIDsValidationMessage = this._selectedEntityType === 'Campaign' ?
			'EntityID should be a valid campaign ID' : 'EntityIDs should be a valid number or comma separated number'
	}

	get selectedEntityType(): string {
		return this._selectedEntityType
	}

	set selectedEntityType(value: string) {
		this.shouldDisableSubmit() // react to changes
		this._selectedEntityType = value
	}

	onSubmit(): void {
		// console.log('[onSubmit]', this._selectedEntityType)
		switch (this._selectedEntityType) {
			case 'Placement':
				this.adsupdate.updatebyPlacements(this.entityIDs)
				break
			case 'Campaign':
				this.adsupdate.updatebyCampaign(this.entityIDs)
				break
			default:
				this.notifications.notify('error', 'EntityType is not supported', !0)
		}
	}

}
