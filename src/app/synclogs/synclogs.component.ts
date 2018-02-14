import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatTableDataSource } from '@angular/material'
import { NotificationsService } from '../services/notifications.service'
import { ElasticAPIClientService } from '../services/elastic-client.service'
import { validateNumberField, validate, validDate, validateNF } from '../public/validators'
import { unAwareToTime } from '../public/utils'
import { entityTypes } from '../data/entitytypes'
import { platforms } from '../data/platforms'
import { MsqbClient } from '../services/msqb-api-client.service'
import { SyncLogsRecordSet } from '../data/slrecordset'
// we are importing a lot of functionality here - we shouldn't
import * as moment from 'moment'
// customize date format
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'

@Component({
	selector: 'app-synclogs',
	templateUrl: './synclogs.component.html',
	styleUrls: ['./synclogs.component.css'],
	providers: [
		MsqbClient,
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ] },
		{ provide: MAT_DATE_FORMATS, useValue: {
				parse: { dateInput: 'LL' },
				display: { dateInput: 'LL',	monthYearLabel: 'MMM YYYY',	dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
			}
		},
		ElasticAPIClientService
	]
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

	// SAS Date picker
	minDate = moment([2017, 0, 1])
	maxDate = moment([])
	startDateCtrl: FormControl
	endDateCtrl: FormControl
	sasSyncLogs: any

	constructor(
		private notifications: NotificationsService,
		private msqbClient: MsqbClient,
		private elasticClient: ElasticAPIClientService
	) { }

	ngOnInit() {

		this.platformFormCtrl = validate('', [ Validators.required ])
		this.entityTypeFormCtrl = validate('', [ Validators.required ])
		this.entityIDFormCtrl = validate('', [ Validators.required, validateNumberField ])

		this.platformFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())

		this.startDateCtrl = validate({ value: moment([]).subtract(3, 'days'), disabled: false }, [ validDate ])
		this.endDateCtrl = validate({ value: moment(), disabled: false }, [ validDate ])

		this.startDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.endDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.platformFormCtrl.hasError('required')
		// || this.selectedPlatform !== 'mdx2' // we dont' have data source for elastic db
			|| (this.selectedPlatform === 'mdx2' && this.entityTypeFormCtrl.hasError('required'))
		// we now have data source from elastic so add a validation
			|| (this.selectedPlatform === 'sas' &&
				(validateNF(this.startDateCtrl.value, this.endDateCtrl.value, 2.592e+9)
				|| this.startDateCtrl.hasError('notValidDate') || this.endDateCtrl.hasError('notValidDate')))
				|| this.entityIDFormCtrl.hasError('required')
					|| this.entityIDFormCtrl.hasError('notNumber')
	}

	onSubmit(): void {
		if (this.selectedPlatform === 'mdx2') {			
			this.msqbClient.getSyncLogs(this.entityType, this.entityID)
			.subscribe((result) => {
				this.sasSyncLogs = void 0
				if (result.success && result.length > 0) {
					this.notifications.notify('success', `Get Sync logs for entityType:${ this.entityType }, entityID:${ this.entityID } competed.`)
					this.mdx2DataSource = new MatTableDataSource<SyncLogsRecordSet>(result.recordset)
				} else {
					this.notifications.notify('info', 'Can\'t find sync logs for this entity for the last 3 days.', !0)
				}
			}, (error) => {
				this.notifications.notify('error', error.message, !0)
			})
		}
		if (this.selectedPlatform === 'sas') {
			const startts = unAwareToTime(this.startDateCtrl.value)
			const endts = unAwareToTime(this.endDateCtrl.value, !0)
			this.elasticClient.getSyncLogs(this.entityID, startts, endts)
			.subscribe((result) => {
				this.mdx2DataSource = void 0
				if (result.hits && result.hits.total > 0) {

					// sort hits ascending
					this.sasSyncLogs = result.hits.hits.sort((a, b) => {
						const anum: any = moment(a._source.eventtime).format('x')
						const bnum: any = moment(b._source.eventtime).format('x')
						return anum - bnum
					})
					this.notifications.notify('success', `Get Sync logs for entityType:${ this.entityType }, entityID:${ this.entityID } competed.`)
				} else {
					this.notifications.notify('info', 'Can\'t find sync logs for this entity.', !0)
				}
			}, (error) => {
				this.notifications.notify('error', error.message, !0)
			})
		}
	}
}
