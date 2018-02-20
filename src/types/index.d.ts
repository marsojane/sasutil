declare module 'sasutil.common' {
	interface AppSideNotificationMessage {
		msg: string
		type: 'info' | 'error' | 'success'
		timestamp: number
	}
	interface ApplicationEvent {
		type: string,
		data: {[index: string]: any}
	}
	interface SubscriberFlag {
		name: string
		flag: boolean
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

declare module 'sasutil.dashboard' {
	type Icon = 'sync' | 'warning' | 'error' | 'check'
	type Status = 'connected' | 'noconnection' | 'expired' | 'checking'
	class ConnectionsData {
		icon: string
		message: string
		name: string
		status: Status
	}
}