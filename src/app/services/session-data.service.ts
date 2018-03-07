import { Injectable } from '@angular/core'

@Injectable()
export class SessionDataService {
	private storage: Storage
	constructor(storage?: Storage) {
		this.storage = storage || localStorage
	}
	getData(name: string): any {
		return this.storage.getItem(name)
	}
	setData(name: string, value: any): void {
		this.storage.setItem(name, value)
	}
}
