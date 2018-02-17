export class SyncLogsRecordSet {
	IndexID: number
	ObjectID: number
	ShouldDelete: number
	CommandStatus: number
	ObjectType: number
	CreationDate: string
	CompletionDate: string
}

export class SyncLogsRecordSASSet {
	timestamp: string
	type: string
	channel: string
	eventid: number
	status: string
	source: any
}
