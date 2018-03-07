import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { providers } from '../data/apiserviceproviders'
import { format } from '../public/utils'

import { APIClient } from './apiclient'

@Injectable()
export class MsqbClient extends APIClient {
	constructor(httpClient: HttpClient) {
		super(httpClient)
		this.provider = providers['msqb']
	}
	public getSyncLogs(type: number, id: number): Observable<any> {
		return this.constructRequest('get', format('/synclogs/mdx2/type/{0}/id/{1}', type, id))
	}

	public getEntityInfo(type: string | number, id: number): Observable<any> {
		return this.constructRequest('get', format('/entityinfo/platform/sas/type/{0}/id/{1}', type, id))
	}

	public statusCheck(): Observable<any> {	
		return this.constructRequest('get', '/status')
	}
}
