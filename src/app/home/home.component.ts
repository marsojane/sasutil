import { Component, OnInit } from '@angular/core'
import { SASLoginParams } from 'apptypes.api'
import { NotificationsService } from '../notifications/notifications.service'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	constructor(private notifications: NotificationsService) { }
	ngOnInit() {
		//
	}
}
