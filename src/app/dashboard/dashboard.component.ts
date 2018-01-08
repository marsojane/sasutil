import { Component, OnInit } from '@angular/core'
import { appsNav } from '../data/appsnav'
import { filter } from 'lodash'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	public appsNav = filter(appsNav, (nav) => nav.enabled)
	constructor() { }
	ngOnInit() {  }
}
