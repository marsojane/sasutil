import { Provider } from 'apptypes.api'

export const providers: {[index: string]: Provider} = {
	'sas': {
		'base': 'https://api.sizmek.com/rest/',
		'reqHeaders': {
			'content-type': 'application/json'
		}
	}
}
