import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry, MatTableDataSource } from '@angular/material'
import { PropertyChangesSet } from '../data/propchangesset'

import * as lo_ from 'lodash'

@Component({
	selector: 'app-historydialog',
	templateUrl: './historydialog.component.html',
	styleUrls: ['./historydialog.component.css']
})
export class HistoryDialogComponent implements OnInit {

	@ViewChild('rawcontentinput') rawcontentinput: ElementRef
	public dataStr: string
	public opChangesDS: MatTableDataSource<PropertyChangesSet>
	public opChangesColumns = ['Field', 'ParentField', 'ContainerID', 'OldValue', 'NewValue']

	constructor(
		public dialogRef: MatDialogRef<HistoryDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer
	) { 
		iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg'))
		iconRegistry.addSvgIcon('copy', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/copy.svg'))
	}

	ngOnInit() {
		this.dataStr = JSON.stringify(this.data)
		if (this.data.raw.propertyChange && this.data.raw.propertyChange.propertyChanges.length > 0) {
			let opChanges: PropertyChangesSet[] = []
			const fillOpChanges = (change: any): void => {
				if (change.type && change.type === 'TerminalPropertyChange') {
					let a
					opChanges.push({
						Field: change.field,
						ParentField: (a = change.parentField.split('.'), a[a.length - 1]),
						ContainerID: change.containerId,
						OldValue: change.valueOld,
						NewValue: change.valueNew
					})
				} else {
						lo_.forEach((change.propertyChanges || change.objectPropertyChangeList), c => {	
						fillOpChanges(c)
					})
				}
			}
			lo_.forEach(this.data.raw.propertyChange.propertyChanges, change => {
				fillOpChanges(change)
			})
			this.opChangesDS = new MatTableDataSource<PropertyChangesSet>(opChanges)
		}
	}

	onNoClick(): void {
		this.dialogRef.close()
	}

	closeDialog(): void {
		this.dialogRef.close()
	}

	copyToClipBoard(): void {
		this.rawcontentinput.nativeElement.select()
		document.execCommand('Copy')
	}

}
