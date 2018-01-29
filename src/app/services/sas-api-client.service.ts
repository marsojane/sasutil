import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { SessionDataService } from './session-data.service'
import { SASLoginParams } from 'sasutil.api.sas'
import { providers } from '../data/apiserviceproviders'
import { format } from '../public/utils'

import { APIClient } from './apiclient'

@Injectable()
export class SasApiClientService extends APIClient {
	constructor(httpClient: HttpClient, sessionData: SessionDataService ) {
		super(httpClient, sessionData)
		this.provider = providers['sas']
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

	public statusCheck(): Observable<any> {
		return this.constructRequest('get', '/login/tokens/check', this.sessionData.getData('sessionId'))
	}
}
