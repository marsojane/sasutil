import { Component, OnInit } from '@angular/core'
import { NotificationsService } from '../notifications/notifications.service'
import { FormControl, Validators } from '@angular/forms'
import { MatTableDataSource } from '@angular/material'
import { validateNumberField, validate } from '../validators'
import { entityTypes } from '../entitytypes'
import { platforms } from '../platforms'
import { MsqbClient } from '../api-client/msqb-client.service'
import { RecordSet } from './recordset'

// rx declarations
// import { Observable } from 'rxjs/Observable'
// import 'rxjs/add/observable/from'
// import 'rxjs/add/operator/concatAll'

@Component({
	selector: 'app-cmqueue',
	templateUrl: './cmqueue.component.html',
	styleUrls: ['./cmqueue.component.css']
})
export class CmqueueComponent implements OnInit {

	platforms = platforms

	selectedPlatform: string
	entityTypes: {[index: string]: any} = entityTypes
	entityID: number
	entityType: number
	disableSubmit = true

	platformFormCtrl: FormControl
	entityTypeFormCtrl: FormControl
	entityIDFormCtrl: FormControl

	mdx2DisplayedColumns = ['ObjectID', 'ShouldDelete', 'CommandStatus', 'ObjectType', 'CreationDate', 'CompletionDate']
	mdx2DataSource: MatTableDataSource<RecordSet>

	constructor(
		private notifications: NotificationsService,
		private msqbClient: MsqbClient
	) {	}

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
		this.disableSubmit = this.platformFormCtrl.hasError('required')
		|| this.selectedPlatform !== 'mdx2' // we dont' have data source for elastic db
			|| (this.selectedPlatform === 'mdx2' && this.entityTypeFormCtrl.hasError('required'))
				|| this.entityIDFormCtrl.hasError('required')
					|| this.entityIDFormCtrl.hasError('notNumber')
	}

	onSubmit(): void {
		this.selectedPlatform === 'mdx2' && this.msqbClient.getSyncLogs('mm2', this.entityType, this.entityID).subscribe((result) => {
			this.notifications.notify(`Get Sync logs for entityType:${ this.entityType }, entityID:${ this.entityID } is successful`)
			// console.log('result', result)
			this.mdx2DataSource = new MatTableDataSource<RecordSet>(result.recordset)
		}, (error) => {
			this.notifications.notify(error.message, !0)
		})
	}

}
