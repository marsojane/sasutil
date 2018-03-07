import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { NotificationsService } from './notifications.service'
import { format } from '../public/utils'

@Injectable()
export class HttpMainMiddleware implements HttpInterceptor {
	constructor(private notifications: NotificationsService) { }
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// console.log('HttpMainMiddleware (intercept)')
		this.logRequest(req.url, req.method)
		return next.handle(req)
	}

	public logRequest(url: string, method: string): void {
		// filter logging from calls to svg files
		!url.match(/\.svg$/i) && this.notifications.notify('info', format('Http request to URL: {0}, method: {1}', url, method))
	}
}
