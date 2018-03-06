import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { SessionDataService } from './session-data.service'
import { format, inArray } from '../public/utils'
import { Provider } from 'sasutil.api'
import { environment } from '../../environments/environment'

export class APIClient {
	protected provider: Provider
	constructor(protected httpClient: HttpClient, protected sessionData?: SessionDataService ) {}
	public constructRequest(method: string, url: string, sessionId?: string, body?: any): Observable<any> {

		const requestURL = this.getReqURL(url)
		const requestHeaders = this.getReqHeaders(sessionId)

		return inArray(method, ['post', 'put']) ? this.httpClient[method](requestURL, body, {
			headers: new HttpHeaders(requestHeaders)
		}) :  this.httpClient[method](requestURL, {
			headers: new HttpHeaders(requestHeaders)
		})
	}

	public getReqURL(url: string): string {
		return format('{0}{1}', this.provider.base, url)
	}

	public getReqHeaders(sessionId?: string): any {
		let requestHeaders
		requestHeaders = {
			'content-type': 'application/json'
		}
		if (!!sessionId) {
			requestHeaders['Authorization'] = sessionId
		}
		return requestHeaders
	}

	// provide an interface for testing
	public get $provider(): Provider | undefined {
		if (!environment.testing) {
			return void 0
		}
		return this.provider
	}

	public set $provider(provider: Provider) {
		if (environment.testing) {
			this.provider = provider
		}
	}
}
