import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry } from '@angular/material'

@Component({
	selector: 'app-historydialog',
	templateUrl: './historydialog.component.html',
	styleUrls: ['./historydialog.component.css']
})
export class HistoryDialogComponent implements OnInit {

	@ViewChild('rawcontentinput') rawcontentinput: ElementRef
	public dataStr: string

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
