import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { MatTableDataSource, MatIconRegistry, MatDialog, MatPaginator } from '@angular/material'
import { NotificationsService } from '../services/notifications.service'
import { ElasticAPIClientService } from '../services/elastic-client.service'
import { validateNumberField, validate, validDate, validateNF } from '../public/validators'
import { unAwareToTime, format } from '../public/utils'
// we are importing a lot of functionality here - we shouldn't
import * as moment from 'moment'
import * as lo_ from 'lodash'
// customize date format
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { ElasticMultiSearchRecordSet } from '../data/esmsearchset'
import { ESResultDialogComponent } from '../esresdialog/esresdialog.component'
// testing only, need a way to remove this in prod
// always remove this on prod compile so webpack don't include in the bundle
// import { mock_esmsearch } from '../data/mock/esmsearch'


@Component({
	selector: 'app-esmsearch',
	templateUrl: './esmsearch.component.html',
	styleUrls: ['./esmsearch.component.css'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ] },
		{ provide: MAT_DATE_FORMATS, useValue: {
				parse: { dateInput: 'LL' },
				display: { dateInput: 'LL',	monthYearLabel: 'MMM YYYY',	dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
			}
		},
		ElasticAPIClientService
	]
})
export class ESMSearchComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator) paginator: MatPaginator
	disableSubmit = true
	entityID: number
	minDate = moment([2017, 0, 1])
	maxDate = moment([])
	startDateCtrl: FormControl
	endDateCtrl: FormControl
	entityIDFormCtrl: FormControl
	notifiedOnceMaxDate = false
	searchResults: any
	searchResultsTableDS: MatTableDataSource<ElasticMultiSearchRecordSet>
	searchResultsColumns = ['timestamp', 'type', 'environment/channel', 'level/severity', 'server', 'service', 'eventid', 'source']
	showSearchResultsTable = false

	constructor(
		private notifications: NotificationsService,
		private elasticClient: ElasticAPIClientService,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private dialog: MatDialog
	) {
		iconRegistry.addSvgIcon('more', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more.svg'))
	}

	ngOnInit() {
		this.entityIDFormCtrl = validate('', [ Validators.required, validateNumberField ])
		this.startDateCtrl = validate({ value: moment([]).subtract(2, 'days'), disabled: false }, [ validDate ])
		this.endDateCtrl = validate({ value: moment(), disabled: false }, [ validDate ])

		this.startDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.endDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())

		this.searchResults = [{ _type: 'Init', 
		_source: { '@timestamp': '0000-00-00', environment: '', level: '', server: '', service: '', eventID: '' }}]
		this.searchResultsTableDS = new MatTableDataSource<ElasticMultiSearchRecordSet>(this.searchResults)
	}

	ngAfterViewInit() {
		this.searchResultsTableDS.paginator = this.paginator
	}

	shouldDisableSubmit(): void {
		if (validateNF(this.startDateCtrl.value, this.endDateCtrl.value, 2.592e+8) && !this.notifiedOnceMaxDate) {
			this.notifications.notify('info', 'Due to performance concerns, search is limited only to 3 days and results are capped to 100000', !0)
			this.notifiedOnceMaxDate = true
		}

		this.disableSubmit = validateNF(this.startDateCtrl.value, this.endDateCtrl.value, 2.592e+8)
				|| this.startDateCtrl.hasError('notValidDate')
				|| this.endDateCtrl.hasError('notValidDate')
				|| this.entityIDFormCtrl.hasError('required')
				|| this.entityIDFormCtrl.hasError('notNumber')
	}

	applyFilter(filterValue: string) {
		this.searchResultsTableDS.filter = filterValue.trim().toLowerCase()
	}

	showMore(result: any) {
		let dialogRef = this.dialog.open(ESResultDialogComponent, {
			height: '90%',
			width: '90%',
			data: result
		})
	}


	filterPredicate(data: any, filter: string): boolean {
		return format('{0}{1}{2}{3}{4}{5}',
			data._source['@timestamp'],
			data._type,
			(data._source.environment || data._source.channel),
			(data._source.level || data._source.severity),
			data._source.server,
			data._source.service,
			data._source.eventID
		).toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
	}

	onSubmit(): void {

		// we need to be careful with users who manipulate the DOM to bypass this.
		if (validateNF(this.startDateCtrl.value, this.endDateCtrl.value, 2.592e+8)) {
			this.notifications.notify('error', 'Due to performance concerns, search is limited only to 3 days and results are capped to 100000', !0)
			return
		}
		const startts = unAwareToTime(this.startDateCtrl.value)
		const endts = unAwareToTime(this.endDateCtrl.value, !0)
		this.elasticClient.multiSearch(this.entityID, startts, endts)
		.subscribe((result) => {
			if (result.hits && result.hits.total > 0) {
				this.searchResults = result.hits.hits.sort((a, b) => {
					const anum: any = moment(a._source['@timestamp']).format('x')
					const bnum: any = moment(b._source['@timestamp']).format('x')
					return anum - bnum
				})
				this.searchResultsTableDS = new MatTableDataSource<ElasticMultiSearchRecordSet>(this.searchResults)
				this.searchResultsTableDS.filterPredicate = this.filterPredicate
				this.searchResultsTableDS.paginator = this.paginator
				this.showSearchResultsTable = true
				this.notifications.notify('success', `Multi search for entity:${ this.entityID } returned ${ result.hits.total  } results.
				Actual returned length: ${ this.searchResults.length }`)
			} else {
				this.notifications.notify('info', 'No results found. :(', !0)
			}
		}, (error) => {
			this.notifications.notify('error', error.message, !0)
		})
	}
}
