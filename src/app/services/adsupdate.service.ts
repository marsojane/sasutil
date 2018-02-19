import { Injectable } from '@angular/core'
import { NotificationsService } from './notifications.service'
import { SasApiClientService } from './sas-api-client.service'
import { SessionDataService } from './session-data.service'
import * as lo_ from 'lodash'
import { Observable } from 'rxjs/Observable'
import { bufferCount } from 'rxjs/operators'
import { reduceFrom } from '../public/utils'

@Injectable()
export class AdsupdateService {
	constructor(
		private notifications: NotificationsService,
		private sizmekApiClient: SasApiClientService,
		private sessionData: SessionDataService
	) { }

	updatebyAdIds(adIds: string): void {
		this.sizmekApiClient.getAds(adIds)
		.pipe(bufferCount(10))
		.subscribe((value) => {
				this.sizmekApiClient.updateAds({entities: value}).subscribe(() => {
				this.notifications.notify('success', `Calling updateAds for adIds ${ reduceFrom(value, 'id').join(', ') } success`, !0)
			}, (error) => {
				this.notifications.notify('error', error.message, !0)
			})
		}, (error) => {
				this.notifications.notify('error', error.message, !0)
		}, () => {
			this.notifications.notify('success', `Updating ads for adIds ${ adIds } has completed`, !0)
		})
	}

	updatebyPlacements(placementIDs: string): void {
		const source = Observable.create((observer) => {
			let placementIDsArray = lo_.uniq(placementIDs.split(','))
			const next = () => {
				const placementID = parseInt(placementIDsArray.shift(), 10)
				if (!placementID) {
					placementIDsArray.length > 0 && next() || observer.complete()
					return
				}
				this.sizmekApiClient.getMultipleResult<any>(this.sizmekApiClient.getAdsByPlacement, placementID)
				.subscribe((data) => {
					lo_.forEach(data.result, value => observer.next(value))
					next()
				}, (error) => {
					this.notifications.notify('error', error.message, !0)
				})
			}
			next()
		})
		source.pipe(bufferCount(10))
		.subscribe((value) => {
			this.sizmekApiClient.updateAds({entities: value}).subscribe(() => {
				this.notifications.notify('success', `Calling updateAds for adIds ${ reduceFrom(value, 'id').join(', ') } success`, !0)
			}, (error) => {
				this.notifications.notify('error', error.message, !0)
			})
		})
	}

	updatebyCampaign(entityID: any): void {
		if (!( entityID * 1 )) {
			this.notifications.notify('error', `Provided CampaignID ${ entityID } is not a valid.`, !0)
		} else {
			this.sizmekApiClient.getMultipleResult<any>(this.sizmekApiClient.getPlacementsByCampaign, entityID)
			.subscribe((data) => {
				this.updatebyPlacements(reduceFrom(data.result, 'id').join(','))
			}, (error) => {
				this.notifications.notify('error', error.message, !0)
			})
		}
	}

}
