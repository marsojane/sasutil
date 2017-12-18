declare module 'apptypes.common' {
	class Notification {
		msg: string
		type: 'info' | 'error'
	}
}

declare module 'apptypes.api' {
	class SASLoginParams {
		username: string
		password: string
		sessionId?: string
	}
	class Provider {
		'base': string
		'reqHeaders': {[index: string]: string}
	}
}