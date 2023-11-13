import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploaderService } from 'app/services/file-uploader.service';

@Component({
  selector: 'app-files-uploader',
  templateUrl: './files-uploader.component.html',
  styleUrls: ['./files-uploader.component.scss']
})
export class FilesUploaderComponent implements OnInit {

  @Output() UploadedFiles = new EventEmitter<any>();
  @Output() _deleteFile = new EventEmitter<string>();
  @Input() route: string;
  @Input() refId: string = 'file-uploader';
  @Input() images: any[];
  @Input() fileFilter: string = '.';

  currentFile?: File;
  uploadClicked: boolean = false;
  ddFiles: any[] = [];
  anyFileUploaded: boolean = false;
  unuploadedFiles: any[] = [];

  constructor(
    private fileUploaderService: FileUploaderService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if (this.images) {
      this.images.forEach(file => {
        this.ddFiles.push({
          ...file,
          name: file.original_name,
          uploaded: true,
          response: {
            filename: file.filename,
            url: file.url
          }
        })
      })
    }
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
    this.uploadClicked = true;
    Promise.all(this.ddFiles.map(async (_file, i) => {
      if (_file.uploaded == false) {
        const file: File | null = _file
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
                this.ddFiles[i].progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                let response = {
                  status: event.status,
                  filename: event.body.filename,
                  url: event.body.url,
                  message: event.body.message,
                };
                this.ddFiles[i].response = response;
                this.ddFiles[i].uploaded = true;
                this.anyFileUploaded = true;
                this.UploadedFiles.emit(this.ddFiles[i]);
                this.unuploadedFiles.push(this.ddFiles[i]);
              }
            },
            error: (err: any) => {
              this.ddFiles[i].progress = 0;
              if (err.error && err.error.message) {
                this.openSnackBar(err.error.message, '❌');
                let response = {
                  status: err.status,
                  message: err.error.message
                };
                this.ddFiles[i].response = response;
                this.ddFiles[i].uploaded = false;
              } else {
                this.openSnackBar('The file has not been uploaded', '❌');
                let response = {
                  status: 500,
                  message: 'The file has not been uploaded'
                };
                this.ddFiles[i].response = response;
                this.ddFiles[i].uploaded = false;
              }
              this.currentFile = undefined;
            }
          });
        }
        _file = undefined;
      }
    })).then(() => {
      this.uploadClicked = false;
    })
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }


  fileBrowseHandler(ddFiles) {
    this.prepareFilesList(ddFiles);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.uploaded = false;
      item.route = this.route;
      this.ddFiles.push(item);
    }
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

  deleteFile(i) {
    this.ddFiles.splice(i, 1);
  }


  deleteFileFromServer(fileName) {
    this.fileUploaderService.delete(this.route, fileName).subscribe((res) => {
      const index = this.ddFiles.findIndex(item => item.response.filename === fileName)
      this.ddFiles.splice(index, 1);
      this._deleteFile.emit(fileName);
      if (this.ddFiles.length == 0) {
        this.anyFileUploaded = false;
      }
      this.openSnackBar(res.message, '✔');
    }, err => {
      console.log(err);
      this.openSnackBar(err.error.message, '❌');
    })
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      direction: 'ltr',
      panelClass: 'snackbar'
    });
  }
}
