import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { MatTableDataSource, MatIconRegistry, MatDialog, MatPaginator } from '@angular/material'
import { NotificationsService } from '../services/notifications.service'
import { SessionDataService } from '../services/session-data.service'
import { SasApiClientService } from '../services/sas-api-client.service'
import { validateNumberField, validate } from '../public/validators'
import { format } from '../public/utils'
import { HistoryRecordSet } from '../data/historyrecordset'
import { HistoryDialogComponent } from '../historydialog/historydialog.component'
import { entityTypes } from '../data/entitytypes'
// mock data //comment on production build
// import { MockAdHistory } from '../data/mock/AdHistory'
// import { MockDGHistory2 } from '../data/mock/DeliveryGroupHistory_2'

import * as lo_ from 'lodash'
import * as moment from 'moment'

@Component({
	selector: 'app-entityhistory',
	templateUrl: './entityhistory.component.html',
	styleUrls: ['./entityhistory.component.css'],
	providers: [SasApiClientService]
})
export class EntityHistoryComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator) paginator: MatPaginator
	disableSubmit = true
	entityTypes = entityTypes['sas-history']
	entityType: string
	entityID: number	

	entityTypeFormCtrl: FormControl
	entityIDFormCtrl: FormControl

	historyResultsColumns = ['ID', 'Time', 'EntityID', 'EntityType', 'Type', 'PerformedBy', 'source']
	historyResultsDS: MatTableDataSource<HistoryRecordSet>
	historyResultsRaw: HistoryRecordSet[]= [
		{
			ID: 1010, Time: '1010', EntityID: 1010, EntityType: 'dummy', Type: '1010', PerformedBy: '1010', data: {}
		}
	]

	showHistoryResultsTable = false

	constructor(
		private notifications: NotificationsService,
		private sessionData: SessionDataService,
		private sasAPIClient: SasApiClientService,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private dialog: MatDialog
	) { 
		iconRegistry.addSvgIcon('more', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more.svg'))
	}

	ngOnInit() {
		this.entityTypeFormCtrl = validate('', [ Validators.required ])
		this.entityIDFormCtrl = validate('', [ Validators.required, validateNumberField ])

		this.entityTypeFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.historyResultsDS = new MatTableDataSource<HistoryRecordSet>(this.historyResultsRaw)
	}

	ngAfterViewInit() {
		this.historyResultsDS.paginator = this.paginator
	}

	shouldDisableSubmit(): void {
		this.disableSubmit = this.entityTypeFormCtrl.hasError('required')
			|| this.entityIDFormCtrl.hasError('required')
			|| this.entityIDFormCtrl.hasError('notNumber')
	}

	showMore(data: any): void {
		let dialogRef = this.dialog.open(HistoryDialogComponent, {
			height: '90%',
			width: '90%',
			data: data
		})
	}

	onSubmit(): void {
		this.sasAPIClient.getHistory(this.entityID, this.entityType)
		.subscribe((data) => {
			this.historyResultsRaw = []
			lo_.forEach(data.result, (record) => {
				this.historyResultsRaw.push(this.setHistoryResult(record))
			})
			this.historyResultsDS = new MatTableDataSource<HistoryRecordSet>(this.historyResultsRaw)
			this.historyResultsDS.paginator = this.paginator
			this.showHistoryResultsTable = true
		}, (error) => {
			this.notifications.notify('error', error.message, !0)
		})
	}

	setHistoryResult(record: any): HistoryRecordSet {
		const id = record.id, changeDate = moment(record.changedDate), type = record.operationType.split('_')
		if (this.sessionData.getData('userAccountTZ') && this.sessionData.getData('isApiUser') === 'false') {
			// possible formats
			// * GMT - ignore GMT
			// * GMT_Plus_01
			// * GMT_Minus_05
			const tz = this.sessionData.getData('userAccountTZ').split('_')
			tz.length === 3 && changeDate.utcOffset( (tz[2] * 60) * ( tz[1] === 'Plus' ? -1 : 1 ) + changeDate.utcOffset() )
		}
		return {
			ID: id,
			Time: changeDate.format('YYYY-MM-DDTHH:mm:ss.SSS'),
			EntityID: record.entityId,
			EntityType: record.typeOfEntity,
			Type: type.length === 2 ? type[1] : record.operationType,
			PerformedBy: format('{0} ({1})', record.changerUserName, record.changerAccountName),
			data: record
		}
	}
}
