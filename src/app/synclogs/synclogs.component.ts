import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatTableDataSource } from '@angular/material'
import { NotificationsService } from '../services/notifications.service'
import { validateNumberField, validate } from '../public/validators'
import { entityTypes } from '../data/entitytypes'
import { platforms } from '../data/platforms'
import { MsqbClient } from '../services/msqb-api-client.service'
import { SyncLogsRecordSet } from '../data/slrecordset'

@Component({
	selector: 'app-synclogs',
	templateUrl: './synclogs.component.html',
	styleUrls: ['./synclogs.component.css'],
	providers: [MsqbClient]
})
export class SynclogsComponent implements OnInit {

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
	mdx2DataSource: MatTableDataSource<SyncLogsRecordSet>

	constructor(
		private notifications: NotificationsService,
		private msqbClient: MsqbClient
	) { }

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
		|| this.selectedPlatform !== 'mdx2' // we dont' have data source for elastic db
			|| (this.selectedPlatform === 'mdx2' && this.entityTypeFormCtrl.hasError('required'))
				|| this.entityIDFormCtrl.hasError('required')
					|| this.entityIDFormCtrl.hasError('notNumber')
	}

	onSubmit(): void {		
		this.selectedPlatform === 'mdx2' && this.msqbClient.getSyncLogs('mm2', this.entityType, this.entityID)
		.subscribe((result) => {
			if (result.success && result.length > 0) {
				this.notifications.notify('success', `Get Sync logs for entityType:${ this.entityType }, entityID:${ this.entityID } is successful`)
				this.mdx2DataSource = new MatTableDataSource<SyncLogsRecordSet>(result.recordset)
			} else {
				this.notifications.notify('info', 'There seems to be no sync logs for this entity for the last 3 days.', !0)
			}
		}, (error) => {
			this.notifications.notify('error', error.message, !0)
		})
	}

}
