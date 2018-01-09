import { Injectable } from '@angular/core'
import { NotificationsService } from './notifications.service'
import { SasApiClientService } from './sas-api-client.service'
import { SessionDataService } from './session-data.service'
import * as lo_ from 'lodash'

@Injectable()
export class AdsupdateService {
	constructor(
		private notifications: NotificationsService,
		private sizmekApiClient: SasApiClientService,
		private sessionData: SessionDataService
	) { }

	updatebyPlacements(entityIDs: any): void {
		// breakdown the entityIDs and run the get & update per placement
		const entityIDs_ = entityIDs.split(',')
		const iterate = () => {
			const entityID = entityIDs_.shift()
			if (entityID) {
				this.notifications.notify('info', `Callings getAdsByPlacement for Placement ${ entityID }`)
				this.sizmekApiClient.getAdsByPlacement(entityID) // need to support pagination here
				.subscribe((result) => {
					if (result.metadata && result.metadata.total === 0) {
						this.notifications.notify('info', `Placement ${ entityID } has no placement ads`)
						iterate()
					} else {
						const reqBody = {
							entities: result.result
						}
						this.sizmekApiClient.updateAds(reqBody).subscribe(() => {
							this.notifications.notify('success', `Callings updateAds for Placement ${ entityID } success`)
							iterate()
						}, (error) => {
							this.notifications.notify('error', error.message, !0)
							iterate()
						})
					}
				}, (error) => {
					this.notifications.notify('error', error.message, !0)
				})
			} else {
				this.notifications.notify('success', 'All placements has been processed', !0)
			}
		}
		iterate()
	}

	updatebyCampaign(entityID: any): void {
		if (!( entityID * 1 )) {
			this.notifications.notify('error', `Provided CampaignID ${ entityID } is not a valid.`, !0)
		} else {
			let placementIDs: number[] = []
			let total = 0
			const iterate = (from: number) => {
				const max = 50
				this.notifications.notify('info', `Callings getPlacementsByCampaign for Placement ${ entityID }, from=${ from }, max=${ max }`)
				this.sizmekApiClient.getPlacementsByCampaign(entityID, from, max)
					.subscribe((result) => {
						if (total === 0 && result.metadata.total > max) {
							total = result.metadata.total
						}
						for (let i = 0; i < result.result.length; i++) {
							placementIDs.push(result.result[i].id)
						}
						total -= max
						if (total >= 0) {
							iterate(from + max)
						} else {
							this.notifications.notify('info', `Start updating placements for Campaign ${ entityID }`)
							this.updatebyPlacements(lo_.uniq(placementIDs).join(','))
						}
					}, (error) => {
						this.notifications.notify('error', error.message, !0)
					})
			}
			iterate(0)
		}
	}

}
