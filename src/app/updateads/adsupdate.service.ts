import { Injectable } from '@angular/core'
import { NotificationsService } from '../notifications/notifications.service'
import { SizmekApiClient } from '../api-client/sizmek-api-client'
import { SessionDataService } from '../session-data.service'
import * as lo_ from 'lodash'

@Injectable()
export class AdsupdateService {

	constructor(
		private notifications: NotificationsService,
		private sizmekApiClient: SizmekApiClient,
		private sessionData: SessionDataService
	) { }

	updatebyPlacements(entityIDs: any): void {
		// breakdown the entityIDs and run the get & update per placement
		const entityIDs_ = entityIDs.split(',')

		const iterate = () => {
			const entityID = entityIDs_.shift()
			if (entityID) {
				this.notifications.notify(`Callings getAdsByPlacement for Placement ${ entityID }`)
				this.sizmekApiClient.getAdsByPlacement(entityID)
				.subscribe((result) => {
					const reqBody = {
						entities: result.result
					}
					this.sizmekApiClient.updateAds(reqBody).subscribe((result_) => {
						this.notifications.notify(`Callings updateAds for Placement ${ entityID } success`)
						iterate()
					}, (error) => {
						this.notifications.notify(error.message, !0)
						iterate()
					})
				}, (error) => {
					this.notifications.notify(error.message, !0)
				})
			} else {
				this.notifications.notify('All placements has been processed')
			}
		}

		iterate()
	}

	updatebyCampaign(entityID: any): void {
		if (!( entityID * 1 )) {
			this.notifications.notify(`Provided CampaignID ${ entityID } is not a valid.`, !0)
		} else {
			let placementIDs: number[] = []
			let total = 0
			const iterate = (from: number) => {
				const max = 50
				this.notifications.notify(`Callings getPlacementsByCampaign for Placement ${ entityID }, from=${ from }, max=${ max }`)
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
							this.notifications.notify(`Start updating placements for Campaign ${ entityID }`)
							this.updatebyPlacements(lo_.uniq(placementIDs).join(','))
						}
					}, (error) => {
						this.notifications.notify(error.message, !0)
					})
			}
			iterate(0)
		}
	}
}
