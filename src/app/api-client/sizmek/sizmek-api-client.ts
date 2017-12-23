import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { Provider, SASLoginParams } from 'apptypes.api' // Method type should be used in constructRequest
import { providers } from '../providers'
// import { ApiClientService } from '../api-client.service'
import { format } from '../../utils'

@Injectable()
export class SizmekApiClient {
	private provider: Provider = providers['sas']
	constructor(private httpClient: HttpClient) {}
	public constructRequest(method: string, url: string, body?: any): Observable<any> {

		const requestURL = this.getReqURL(url)
		const requestHeaders = this.getReqHeaders()

		return this.httpClient[method](requestURL, body, {
			headers: requestHeaders
		})
	}
	public login(params: SASLoginParams): Observable<any> {
		return this.constructRequest('post', '/login/login', params)
	}
	public getReqURL(url: string): string {
		return format('{0}{1}', this.provider.base, url)
	}
	public getReqHeaders(): HttpHeaders {
		const httpHeaders: HttpHeaders = new HttpHeaders
		for (const header in this.provider.reqHeaders) {
			if ( this.provider.reqHeaders.hasOwnProperty(header) ) {
				httpHeaders.set(header, this.provider.reqHeaders[header])
			}
		}
		return httpHeaders
	}
}
