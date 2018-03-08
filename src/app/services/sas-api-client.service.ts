import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { SessionDataService } from './session-data.service'
import { SASLoginParams } from 'sasutil.api.sas'
import { providers } from '../data/apiserviceproviders'
import { format } from '../public/utils'

import { APIClient } from './apiclient'
import * as lo_ from 'lodash'

@Injectable()
export class SasApiClientService extends APIClient {
	constructor(httpClient: HttpClient, sessionData: SessionDataService ) {
		super(httpClient, sessionData)
		this.provider = providers['sas']
	}
	public login(params: SASLoginParams): Observable<any> {
		return this.constructRequest('post', '/login/login', null, params)
	}

	public getAd(adId: number): Observable<any> {
		return this.constructRequest('get', format('/ads/{0}', adId), this.sessionData.getData('sessionId'))
	}

	public getAds(adIds: string): Observable<any> {
		return Observable.create((observer) => {
			let adIdsArray = lo_.uniq(adIds.split(','))
			const next = () => {
				const adId = parseInt(adIdsArray.shift(), 10)
				if (!adId) {
					adIdsArray.length > 0 && next() || observer.complete()
					return
				}
				this.getAd(adId).subscribe((data) => {
					observer.next(data.result)
					next()
				})
			}
			next()
		})
	}

	public getAdsByPlacement(placementID: number, from?: number, max?: number): Observable<any> {
		from = from || 0
		max = max || 150
		return this.constructRequest('get',
			format('/ads?placementId={0}&from={1}&max={2}', placementID, from, max),
				this.sessionData.getData('sessionId'))
	}

	public getPlacementsByCampaign(CampaignID: number, from?: number, max?: number): Observable<any> {
		from = from || 0
		max = max || 150
		const reqURL = format('/placements?campaignId={0}&from={1}&max={2}&order=asc&sort=name', CampaignID, from, max)
		return this.constructRequest('get',
					reqURL,
						this.sessionData.getData('sessionId'))
	}

	public updateAds(reqBody: any):  Observable<any> {
		return this.constructRequest('put', '/ads', this.sessionData.getData('sessionId'), reqBody)
	}

	public syncEntities(entityType: string, ids: string): Observable<any> {
		let body: any = {
			entities: [{
				ids: ids.split(','),
				entityType: entityType,
				queueNames: ['EDS-Client']
			}]
		}
		return this.constructRequest('post', '/replay/syncLastEntities', this.sessionData.getData('sessionId'), body)
	}

	public statusCheck(): Observable<any> {
		return this.constructRequest('get', '/login/tokens/check', this.sessionData.getData('sessionId'))
	}

	public getAccountSettings(id: number): Observable<any> {
		return this.constructRequest('get', format('/accounts/{0}', id), this.sessionData.getData('sessionId'))
	}

	public getHistory(id: number, type: string): Observable<any> {
		return this.constructRequest('get', format('/history/entityhistory?id={0}&type={1}&sort=changedDate&order=desc', id, type), this.sessionData.getData('sessionId'))
	}

	public getMultipleResult<T>(provider: Function, ...params: any[]): Observable<{ metadata: any, result: T}> {
		let from = 0, max = 10, total, results: T[]
		return Observable.create((observer) => {
			const next = () => {
				typeof total === 'number' && (from += max)
				provider.apply(this, lo_.flatten([params]).concat([from, max])).subscribe((data) => {
					typeof total !== 'number' && (total = data.metadata.total)
					total -= max
					results = lo_.union(results, data.result)
					typeof total === 'number' && total > 0 ? next() : (observer.next({ metadata: data.metadata, result: results}), observer.complete())
				}, (error) => {
					observer.error(error)
				}) 
			}
			next()
		})
	}
}
