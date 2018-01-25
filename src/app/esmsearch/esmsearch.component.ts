import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { NotificationsService } from '../services/notifications.service'
import { ElasticAPIClientService } from '../services/elastic-client.service'
import { validateNumberField, validate, validDate, validateNF } from '../public/validators'
import { unAwareToTime } from '../public/utils'
// we are importing a lot of functionality here - we shouldn't
import * as moment from 'moment'
// customize date format
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'

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
export class ESMSearchComponent implements OnInit {

	disableSubmit = true
	entityID: number
	minDate = moment([2017, 0, 1])
	maxDate = moment([])
	startDateCtrl: FormControl
	endDateCtrl: FormControl
	entityIDFormCtrl: FormControl
	notifiedOnceMaxDate = false
	searchResults: any

	constructor(
		private notifications: NotificationsService,
		private elasticClient: ElasticAPIClientService
	) { }

	ngOnInit() {
		this.entityIDFormCtrl = validate('', [ Validators.required, validateNumberField ])
		this.startDateCtrl = validate({ value: moment([]).subtract(2, 'days'), disabled: false }, [ validDate ])
		this.endDateCtrl = validate({ value: moment(), disabled: false }, [ validDate ])

		this.startDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.endDateCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
		this.entityIDFormCtrl.valueChanges.subscribe(() => this.shouldDisableSubmit())
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
					const anum: any = moment(a._source.eventtime).format('x')
					const bnum: any = moment(b._source.eventtime).format('x')
					return anum - bnum
				})
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
