import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { Provider  } from 'sasutil.api'
import { providers } from '../data/apiserviceproviders'
import { format, inArray } from '../public/utils'


@Injectable()
export class MsqbClient {

	private provider: Provider = providers['msqb']
	constructor(
		private httpClient: HttpClient
	) { }

	public constructRequest(url: string): Observable<any> {
		const requestURL = this.getReqURL(url)
		const requestHeaders = this.getReqHeaders()

		// hope all is get
		return this.httpClient.get(requestURL, {
			headers: new HttpHeaders(requestHeaders)
		})
	}

	public getSyncLogs(platform: string, type: number, id: number): Observable<any> {
		// add handler for sas sync logs here once available
		return this.constructRequest(format('/synclogs/mdx2/type/{0}/id/{1}', type, id))
	}

	public getEntityInfo(platform: string, type: string | number, id: number): Observable<any> {
		// add handler for mm2 ecs entity info here once available or we should support it?
		return this.constructRequest(format('/entityinfo/platform/sas/type/{0}/id/{1}', type, id))
	}

	public getReqURL(url: string): string {
		return format('{0}{1}', this.provider.base, url)
	}

	public getReqHeaders(): any {
		let requestHeaders
		requestHeaders = {
			'content-type': 'application/json'
		}
		return requestHeaders
	}

}
