declare module 'sasutil.common' {
	interface AppSideNotificationMessage {
		msg: string
		type: 'info' | 'error' | 'success'
	}
}

declare module 'sasutil.api' {
	class Provider {
		'base': string
		'reqHeaders': {[index: string]: string}
	}
}

declare module 'sasutil.api.sas' {
	class SASLoginParams {
		username: string
		password: string
		sessionId?: string
	}
}