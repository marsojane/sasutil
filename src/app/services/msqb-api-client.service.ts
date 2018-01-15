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
		// add handler for sas sync logs here once available
		return this.constructRequest('get', format('/synclogs/mdx2/type/{0}/id/{1}', type, id))
	}

	public getEntityInfo(platform: string, type: string | number, id: number): Observable<any> {
		// add handler for mm2 ecs entity info here once available or we should support it?
		return this.constructRequest('get', format('/entityinfo/platform/sas/type/{0}/id/{1}', type, id))
	}
}
