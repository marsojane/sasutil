import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { providers } from '../data/apiserviceproviders'
import { format } from '../public/utils'
import { APIClient } from './apiclient'

@Injectable()
export class ElasticAPIClientService extends APIClient {
	constructor(httpClient: HttpClient ) {
		super(httpClient)
		this.provider = providers['elasticsearch']
	}
	public getSyncLogs(entityId: number, start: number, end: number): Observable<any> {	
		/* tslint:disable */
		const query = format('{"query":{"filtered":{"query":{"query_string":{"query":"task:10 AND entityID:{0}"}},"filter":{"bool":{"must":[{"range":{"@timestamp":{"gte":{1},"lte":{2}}}}],"must_not":[]}}}}}', entityId, start, end)
		/* tslint:enable */	
		// return  this.constructRequest('post', format('/_all/WindowsEventLog/_search', null, JSON.parse(query)))
		return  this.constructRequest('post', '/elastic/search/WindowsEventLog', null, JSON.parse(query))
	}
}
