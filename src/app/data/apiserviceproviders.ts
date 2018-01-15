import { Provider } from 'sasutil.api'

export const providers: {[index: string]: Provider} = {
	'sas': {
		'base': 'https://api.sizmek.com/rest',
		'reqHeaders': {
			'content-type': 'application/json'
		}
	},
	'msqb': {
		'base': 'http://10.10.1.149:8100',
		'reqHeaders': {
			'content-type': 'application/json'
		}
	},
	'elasticsearch': {
		'base': 'http://10.10.1.149:8200',
		'reqHeaders': {
			'content-type': 'application/json'
		}
	}
}
