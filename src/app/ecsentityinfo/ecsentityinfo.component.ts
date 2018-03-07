import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../services/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { validateNumberField, validate } from '../public/validators'
import { entityTypes } from '../data/entitytypes'
import { platforms } from '../data/platforms'
import { MsqbClient } from '../services/msqb-api-client.service'

@Component({
	selector: 'app-ecsentityinfo',
	templateUrl: './ecsentityinfo.component.html',
	styleUrls: ['./ecsentityinfo.component.css'],
	providers: [
		MsqbClient
	]
})
export class EcsEntityInfoComponent implements OnInit {

	platforms = platforms
	selectedPlatform: string
	entityTypes: {[index: string]: any} = entityTypes
	entityID: number
	entityType: string | number
	disableSubmit = true
	ecsInfoSet: any

	platformFormCtrl: FormControl
	entityTypeFormCtrl: FormControl
	entityIDFormCtrl: FormControl	

	constructor(
		private notifications: NotificationsService,
		private msqbClient: MsqbClient
	) { 
		// for now, we only support SAS
		this.selectedPlatform = 'sas'
	}

	ngOnInit() {
		this.platformFormCtrl = validate('', [ Validators.required ])
		this.entityTypeFormCtrl = validate('', [ Validators.required ])
		this.entityIDFormCtrl = validate('', [ Validators.required, validateNumberField ])

		// dont combine obervables its buggy
		this.platformFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.selectedPlatform !== 'sas'
			|| this.platformFormCtrl.hasError('required')
			|| this.entityTypeFormCtrl.hasError('required')
			|| this.entityIDFormCtrl.hasError('required')
			|| this.entityIDFormCtrl.hasError('notNumber')
	}

	onSubmit(): void {
		this.notifications.notify('info', 'This will take some time.', !0)
		this.selectedPlatform === 'sas' && this.msqbClient.getEntityInfo(this.entityType, this.entityID)
		.subscribe((result) => {
			this.notifications.notify('success', 
			`Get Entity Info for entityType:${ this.entityType }, entityID:${ this.entityID } is successful`, !0)
			this.ecsInfoSet = result
		}, (error) => {
			this.notifications.notify('error', error.message, !0)
		})
	}

}
