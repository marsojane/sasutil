import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../notifications/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { validateNumberField, validate } from '../validators'
import { entityTypes } from '../entitytypes'
import { platforms } from '../platforms'
import { MsqbClient } from '../api-client/msqb-client.service'
// import * as lo_ from 'lodash'
// rx declarations
// import { Observable } from 'rxjs/Observable'
// import 'rxjs/add/observable/from'
// import 'rxjs/add/operator/concatAll'

@Component({
	selector: 'app-ecsentityinfo',
	templateUrl: './ecsentityinfo.component.html',
	styleUrls: ['./ecsentityinfo.component.css']
})

export class ECSEntityInfoComponent implements OnInit {

	platforms = platforms

	selectedPlatform: string
	entityTypes: {[index: string]: any} = entityTypes
	entityID: number
	entityType: string | number
	disableSubmit = true

	platformFormCtrl: FormControl
	entityTypeFormCtrl: FormControl
	entityIDFormCtrl: FormControl

	ecsInfoSet: any

	constructor(
		private notifications: NotificationsService,
		private msqbClient: MsqbClient
	) {
		// test values
		// this.selectedPlatform = 'sas'
		// this.entityType = 'Campaign'
		// this.entityID = 1073862012
	}

	ngOnInit() {
		this.platformFormCtrl = validate([ Validators.required ])
		this.entityTypeFormCtrl = validate([ Validators.required ])
		this.entityIDFormCtrl = validate([ Validators.required, validateNumberField ])

		// this is buggy, if the submit has enabled and added an invalid input, no event is emitted. need to check
		/*
		Observable.from([
			this.platformFormCtrl.valueChanges, 
			this.entityTypeFormCtrl.valueChanges, 
			this.entityIDFormCtrl.valueChanges
		]).concatAll().subscribe(() => {
			this.shouldDisableSubmit()
		})
		*/
		// workaround, don't combine
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
		this.selectedPlatform === 'sas' && this.msqbClient.getEntityInfo('sas', this.entityType, this.entityID)
		.subscribe((result) => {
			this.notifications.notify(`Get Entity Info for entityType:${ this.entityType }, entityID:${ this.entityID } is successful`)
			// console.log('result', result)
			this.ecsInfoSet = result
		}, (error) => {
			this.notifications.notify(error.message, !0)
		})
	}
}
