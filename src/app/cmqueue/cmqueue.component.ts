import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../notifications/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { validateNumberField, validate } from '../validators'
import { entityTypes } from '../entitytypes'

@Component({
	selector: 'app-cmqueue',
	templateUrl: './cmqueue.component.html',
	styleUrls: ['./cmqueue.component.css']
})
export class CmqueueComponent implements OnInit {

	platforms = [
		{ value: 'mdx2', viewValue: 'MDX2' }, { value: 'sas', viewValue: 'SAS' }
	]

	selectedPlatform: string
	entityTypes: {[index: string]: any} = entityTypes
	entityID: number
	disableSubmit = true

	platformFormCtrl: FormControl
	entityTypeFormCtrl: FormControl
	entityIDFormCtrl: FormControl

	constructor(
		private notifications: NotificationsService
	) {	}

	ngOnInit() {
		this.platformFormCtrl = validate([ Validators.required ])
		this.entityTypeFormCtrl = validate([ Validators.required ])
		this.entityIDFormCtrl = validate([ Validators.required, validateNumberField ])

		this.platformFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.platformFormCtrl.hasError('required')
			|| (this.selectedPlatform === 'mdx2' && this.entityTypeFormCtrl.hasError('required'))
				|| this.entityIDFormCtrl.hasError('required')
					|| this.entityIDFormCtrl.hasError('notNumber')
	}

	onSubmit(): void {
		//
	}

}
