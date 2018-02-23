export const appsNav = [
	{ link: '/dashboard', view: 'Dashboard', enabled: true },
	{ link: '/gensessionid', view: 'Generate Session ID', enabled: false },
	{ link: '/ecsentityinfo', view: 'Entity Info (ECS)', enabled: true, label: 'Shows information for a specific entity for all ECS DBs (NJ, NL, SG, etc..).' },
	{ link: '/synclogs', view: 'Sync Logs', enabled: true, label: 'Shows sync logs for a specific entity.' },
	{ link: '/syncentity', view: 'Sync Entity', enabled: true, label: 'Sync SAS entities.' },
	{ link: '/resaveads', view: 'Resave Ads', enabled: true, label: 'Resaves ads per campaign, placement and ad level.' },
	{ link: '/esmsearch', view: 'Elastic MultiSearch', enabled: true, label: 'MultiSearch means we search for all indices and types for a specific SAS entity. Results are pulled from Elastic without any filtering so you will get a lot of results both relevant and not-relevant.' },
	{ link: '/integrity', view: 'Integrity Check', enabled: false },
	{ link: '/entityhistory', view: 'Entity History', enabled: true, label: 'A unified history page for SAS entities.' }
]