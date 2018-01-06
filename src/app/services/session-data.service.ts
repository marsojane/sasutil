import { Injectable } from '@angular/core'

@Injectable()
export class SessionDataService {

	constructor() { }
	getData(name: string): any {
		return localStorage.getItem(name)
	}
	setData(name: string, value: any): void {
		localStorage.setItem(name, value)
	}
}
