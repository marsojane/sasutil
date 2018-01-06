declare module 'sasutil.common' {
	interface AppSideNotificationMessage {
		msg: string
		type: 'info' | 'error' | 'success'
	}
}