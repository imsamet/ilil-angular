import { Component, HostListener, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FileUploaderService } from 'app/services/file-uploader.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss']
})
export class VideoUploaderComponent {

  @Output() UploadedFile = new EventEmitter<string>();
  @Output() _deleteFile = new EventEmitter<string>();
  @Input() route: string;
  @Input() video: any;
  @Input() fileFilter: string = 'video/mp4,video/x-m4v,video/*';

  selectedFiles?: FileList;
  currentFile?: File;
  progress: number = 0;
  response: any;

  anyFileUploaded: boolean = false;
  unuploadedFiles: any[] = [];

  size: number;

  @Input() refId: string = 'file-uploader';

  constructor(
    private fileUploaderService: FileUploaderService,
    public snackBar: MatSnackBar,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.response = this.video;
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.anyFileUploaded) {
      this.fileUploaderService.deleteFiles(this.route, this.unuploadedFiles).subscribe((res) => {
        console.log(res);
      })
    }
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
        else if (this.fileFilter == '.' || this.fileFilter == 'video/mp4,video/x-m4v,video/*') {
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
              this.video = event.body.url;
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

  onFileDropped(event) {
    this.selectedFiles = event;
    this.size = this.selectedFiles.item(0).size;
    console.log(this.size);

    this.upload();
  }

  fileBrowseHandler(event) {
    this.selectedFiles = event.target.files;
    this.size = this.selectedFiles.item(0).size;
    console.log(this.size);

    this.upload();
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  deleteFileFromServer(fileName) {
    this.fileUploaderService.delete(this.route, fileName).subscribe((res) => {
      this.response = undefined;
      this.anyFileUploaded = false;
      this.progress = 0;
      this._deleteFile.emit();
    }, err => {
      this.openSnackBar('✔', `${err.message}...`);
    })
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      direction: 'ltr',
      panelClass: 'snackbar'
    });
  }
}
