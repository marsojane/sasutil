import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { SessionDataService } from './session-data.service'

import { Provider } from 'sasutil.api' // Method type should be used in constructRequest
import { SASLoginParams } from 'sasutil.api.sas'
import { providers } from '../data/apiserviceproviders'
import { format, inArray } from '../public/utils'

@Injectable()
export class SasApiClientService {
	private provider: Provider = providers['sas']
	constructor(private httpClient: HttpClient, private sessionData: SessionDataService ) {}
	public constructRequest(method: string, url: string, sessionId?: string, body?: any): Observable<any> {

		const requestURL = this.getReqURL(url)
		const requestHeaders = this.getReqHeaders(sessionId)

		return inArray(method, ['post', 'put']) ? this.httpClient[method](requestURL, body, {
			headers: new HttpHeaders(requestHeaders)
		}) :  this.httpClient[method](requestURL, {
			headers: new HttpHeaders(requestHeaders)
		})
	}
	public login(params: SASLoginParams): Observable<any> {
		return this.constructRequest('post', '/login/login', null, params)
	}
	public getAdsByPlacement(placementID: number): Observable<any> {
		return this.constructRequest('get',
			format('/ads?placementId={0}&from=0&max=150', placementID),
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

	public getReqURL(url: string): string {
		return format('{0}{1}', this.provider.base, url)
	}

	public getReqHeaders(sessionId: string): any {
		let requestHeaders
		requestHeaders = {
			'content-type': 'application/json'
		}
		if (!!sessionId) {
			requestHeaders['Authorization'] = sessionId
		}
		return requestHeaders
	}
}
