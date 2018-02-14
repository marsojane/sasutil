import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry } from '@angular/material'

@Component({
	selector: 'app-esresdialog',
	templateUrl: './esresdialog.component.html',
	styleUrls: ['./esresdialog.component.css']
})
export class ESResultDialogComponent implements OnInit {
	@ViewChild('contentinput') contentinput: ElementRef
	public dataStr: string
	constructor(
		public dialogRef: MatDialogRef<ESResultDialogComponent>,
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
		this.contentinput.nativeElement.select()
		document.execCommand('Copy')
	}

}
