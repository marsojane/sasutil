import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { NotificationsService } from '../notifications/notifications.service'
import { format } from '../utils'

@Injectable()
export class HttpMainMiddleware implements HttpInterceptor {
	constructor(private notifications: NotificationsService) { }
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.notifications.notify(format('Http request to URL: {0}, method: {1}', req.url, req.method))
		return next.handle(req)
	}
}
