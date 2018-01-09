import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { NotificationsService } from './notifications.service'
import { format } from '../public/utils'

@Injectable()
export class HttpMainMiddleware implements HttpInterceptor {
	constructor(private notifications: NotificationsService) { }
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// filter logging from calls to svg files - joey
		req.url.indexOf('.svg') === -1 && this.notifications.notify('info', format('Http request to URL: {0}, method: {1}', req.url, req.method))
		return next.handle(req)
	}
}
