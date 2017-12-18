import { Component, OnInit, Input } from '@angular/core'
import { Notification } from 'apptypes.common'

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
	@Input() msgStack: Notification[]
	ngOnInit() {
	}

}
