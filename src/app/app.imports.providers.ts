import { NotificationsService } from './services/notifications.service'
import { SessionDataService } from './services/session-data.service'
import { HttpMainMiddleware } from './services/http-main-middleware'
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'

export const ProvidersImports = [
	NotificationsService,
	SessionDataService,
	HttpClient,
	// start of Http Middlewares
	{ provide: HTTP_INTERCEPTORS, useClass: HttpMainMiddleware, multi: true }
]