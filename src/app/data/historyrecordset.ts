export class HistoryRecordSet {
	ID: number
	Time: string
	EntityID: number
	EntityType: string
	Type: string
	PerformedBy: string
	source?: any
	raw?: { [index: string]: any }
}