import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable()
export class SessionDataService {
	private storage = localStorage
	constructor() {	}
	getData(name: string): any {
		return this.storage.getItem(name)
	}
	setData(name: string, value: any): void {
		this.storage.setItem(name, value)
	}

	// provide an interface for testing
	public get $storage(): any {
		if (!environment.testing) {
			return void 0
		}
		return this.storage
	}

	public set $storage(storage: any) {
		if (environment.testing) {
			this.storage = storage
		}
	}
}
