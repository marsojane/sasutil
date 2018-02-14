import { Component, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry, MatDialog, MatDialogRef } from '@angular/material'
import { appsNav } from '../data/appsnav'
import { format } from '../public/utils'
import * as lo_ from 'lodash'
import { NotificationsService } from '../services/notifications.service'
import { SessionDataService } from '../services/session-data.service'
import { ElasticAPIClientService } from '../services/elastic-client.service'
import { MsqbClient } from '../services/msqb-api-client.service'
import { SasApiClientService } from '../services/sas-api-client.service'
import { Status, ConnectionsData, Icon } from 'sasutil.dashboard'
import { GensessionidComponent } from '../gensessionid/gensessionid.component'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	providers: [
		ElasticAPIClientService, MsqbClient, SasApiClientService
	]
})
export class DashboardComponent implements OnInit { 
	private genSIDRef: MatDialogRef<GensessionidComponent>
	public appsNav = lo_.filter(appsNav, (nav) => nav.enabled && nav.view !== 'Dashboard')

	public connections: ConnectionsData[] = []
	constructor(
		private sessionData: SessionDataService,
		private notifications: NotificationsService,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private elasticClient: ElasticAPIClientService,
		private msqbClient: MsqbClient,
		private sasAPIClient: SasApiClientService,
		private dialog: MatDialog
	) {
		iconRegistry.addSvgIcon('sync', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sync.svg'))
		iconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check.svg'))
		iconRegistry.addSvgIcon('warning', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/warning.svg'))
		iconRegistry.addSvgIcon('error', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg'))
	}

	ngOnInit() {
		setTimeout(() => {
			this.statusCheck(this.elasticClient, 'Elastic-Bridge')
			this.statusCheck(this.msqbClient, 'MSSQL-Bridge')
			if (this.sessionData.getData('sessionId')) {
				this.statusCheck(this.sasAPIClient, 'SAS-API')
			}

			this.notifications.eventMgr
			.filter((event) => event.type === 'connectionStatusChange')
			.subscribe((event) => {
				const { name, status } = event.data
				lo_.remove(this.connections, (c) => c.name === name),
				this.connections.push(this.setConnectionStatus(name, status))
			})
		})
	}

	setConnectionStatus(name: string, status: Status): ConnectionsData {
		let message: string, icon: Icon
		switch (status) {
			case 'checking':
				message = name === 'SAS-API' && 'Checking SAS API session token status' || format('Checking connection to {0}...', name)
				icon = 'sync'
				break
			case 'connected':
				message = name === 'SAS-API' && 'SAS API session token is valid' || format('Connected to {0}.', name)
				icon = 'check'
				break
			case 'noconnection':
				message = format('Not Connected to {0}.', name)
				icon = 'error'
				break
			case 'expired':
				message = format('Your SAS-API session token has expired or not valid.')
				icon = 'warning'
				break
			default:
				message = format('Error when establishing connection to {0}...', name)
				icon = 'error'
		}
		this.notifications.notify(icon === 'check' ? 'success' : (icon === 'error' ? 'error' : 'info'), message)
		return {
			icon,
			message,
			name,
			status
		}
	}

	statusCheck(client: ElasticAPIClientService | MsqbClient | SasApiClientService, name: string): void {
		this.connections.push(this.setConnectionStatus(name, 'checking'))
		client.statusCheck()
		.subscribe((data) => {
			this.notifications.eventMgr.next({
				type: 'connectionStatusChange',
				data: {
					name,
					status: 'connected'
				}
			})
		}, (error) => {
			const status = error.status === 401 && name === 'SAS-API' ? 'expired' : 'noconnection'
			this.notifications.eventMgr.next({
				type: 'connectionStatusChange',
				data: {
					name,
					status
				}
			})
		})
	}

	genSessionToken(): void {
		this.genSIDRef = this.dialog.open(GensessionidComponent, {
			width: '600px'
		})
	}
}
