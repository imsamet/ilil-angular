import { Component, OnInit, HostListener, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FileUploaderService } from 'app/services/file-uploader.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cover-image-uploader',
  templateUrl: './cover-image-uploader.component.html',
  styleUrls: ['./cover-image-uploader.component.scss']
})
export class CoverImageUploaderComponent {

  @Output() UploadedFile = new EventEmitter<string>();
  @Output() _deleteFile = new EventEmitter<string>();
  @Input() route: string;
  @Input() image: any;
  @Input() fileFilter: string = '.';

  selectedFiles?: FileList;
  currentFile?: File;
  progress: number;
  response: any;

  anyFileUploaded: boolean = false;
  unuploadedFiles: any[] = [];

  constructor(
    private fileUploaderService: FileUploaderService,
    public snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.anyFileUploaded) {
      this.fileUploaderService.deleteFiles(this.route, this.unuploadedFiles).subscribe((res) => {
        console.log(res);
      })
    }
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload()
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        let filter;
        if (this.fileFilter == 'image/*') {
          filter = 'only-images'
        }
        else if (this.fileFilter == '.') {
          filter = 'all-files'
        }
        this.fileUploaderService.upload(this.currentFile, this.route, filter).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.anyFileUploaded = true;
              this.response = event.body;
              this.response.status = event.status;
              this.UploadedFile.emit(event.body);
              this.image = event.body.url;
              this.unuploadedFiles.push(event.body);
              this.progress = 100;
            }
          },
          error: (err: any) => {
            this.progress = 0;
            if (err.error && err.error.message) {
              this.openSnackBar(err.error.message, '❌');
              this.response.message = err.error.message;
            } else {
              this.openSnackBar('Could not upload the file!', '❌');
              this.response.message = 'Could not upload the file!';
            }
            this._changeDetectorRef.markForCheck();
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  deleteFileFromServer(fileName) {
    this.fileUploaderService.delete(this.route, fileName).subscribe((res) => {
      this.response = undefined;
      this.anyFileUploaded = false;
      this._deleteFile.emit();
    }, err => {
      this.openSnackBar('✔', `${err.message}...`);
    })
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      direction: 'rtl',
      panelClass: 'snackbar'
    });
  }

}
