import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Tender } from 'app/types/tender.types';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { TenderService } from 'app/services/tender.service';
import { ApiService } from 'app/services/api.service';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/types/project.types';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { TranslateModalComponent } from 'app/translate-modal/translate-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-tenders',
  templateUrl: './my-tenders.component.html',
  styleUrls: ['./my-tenders.component.scss']
})
export class MyTendersComponent implements OnInit {

  @Input() tenders: Tender[];

  tenderMode: string = 'list';
  tenderForm: UntypedFormGroup;
  tender: any = {};

  files: any[] = [];
  image: any;
  coverImage: any;
  video: any;
  availableLangs: AvailableLangs;
  categories: any[] = [];
  projects: Project[] = [];
  activeLang: string;
  formErrors = {
    title: "",
    category: "",
    shortDescription: "",
    description: "",
    tenderNo: "",
    tenderRegistrationNo: "",
    requestNo: "",
  };

  validationMessages = {
    title: {
      required: "Title is required.",
    },
    category: {
      required: "Category is required.",
    },
    shortDescription: {
      required: "Short description is required.",
    },
    description: {
      required: "Description is required.",
    },
    tenderNo: {
      required: "Tender No is required.",
    },
    tenderRegistrationNo: {
      required: "Tender Registration No is required.",
    },
    requestNo: {
      required: "Reques tNo is required.",
    },
  };

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _tenderService: TenderService,
    private snackBar: MatSnackBar,
    private _apiService: ApiService,
    private _projectService: ProjectService,
    private _translocoService: TranslocoService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.translocoFN();

    this._apiService.getCategories(['Tenders']).subscribe((categories) => {
      this.categories = categories;
      this.createForm();
    });

    this._projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  translocoFN() {
    this.availableLangs = this._translocoService.getAvailableLangs();
    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  createForm() {
    const res = {};
    const res1 = {};
    const res2 = {};
    this.availableLangs.forEach((el) => {
      res[el.id] = new FormControl('');
      res1[el.id] = new FormControl('');
      res2[el.id] = new FormControl('');
    });
    this.tenderForm = this._formBuilder.group({
      title: new FormGroup(res, Validators.required),
      shortDescription: new FormGroup(res1, Validators.required),
      description: new FormGroup(res2),
      category: ['', Validators.required],
      project: [''],
      tenderNo: ['', Validators.required],
      tenderRegistrationNo: ['', Validators.required],
      requestNo: ['', Validators.required],
      tenderStartDate: [{ value: '', disabled: true }, Validators.required],
      tenderEndDate: [{ value: '', disabled: true }, Validators.required],
      lastBidDate: [{ value: '', disabled: true }, Validators.required],
    });

    this.tenderForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.tenderForm) {
      return;
    }
    const form = this.tenderForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous erroe message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.tenderForm.disable();
    for (const key in this.tenderForm.get('title').getRawValue()) {
      if (this.tenderForm.get('title').getRawValue()[key] == '') {
        this.tenderForm.get('title').get(key).setValue(this.tenderForm.get('title').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.tenderForm.get('shortDescription').getRawValue()) {
      if (this.tenderForm.get('shortDescription').getRawValue()[key] == '') {
        this.tenderForm.get('shortDescription').get(key).setValue(this.tenderForm.get('shortDescription').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.tenderForm.get('description').getRawValue()) {
      if (this.tenderForm.get('description').getRawValue()[key] == '') {
        this.tenderForm.get('description').get(key).setValue(this.tenderForm.get('description').getRawValue()[this.activeLang]);
      }
    }

    const data = {
      ...this.tenderForm.getRawValue(),
      image: this.image
        ? {
          url: this.image.url,
          filename: this.image.filename,
        }
        : null,
      files: this.files,
      coverImage: this.coverImage
        ? {
          url: this.coverImage.url,
          filename: this.coverImage.filename,
        }
        : null,
      video: this.video
        ? {
          url: this.video.url,
          filename: this.video.filename,
        }
        : null,
    }
    if (this.tenderMode == 'edit') {
      this._tenderService.updateTender(this.tender._id, data).subscribe((updatedTender) => {
        this.tenderForm.enable();
        const index = this.tenders.findIndex((el) => el._id == this.tender._id);
        this.tenders[index] = updatedTender;
        this.cancel();
        this.openSnackBar("Tender updated successfully", "✔");
      })
    }
    else {
      this._tenderService.createTender(data).subscribe((newTender) => {
        this.tenders.push(newTender);
        this.tenderForm.enable();
        this.cancel();
        this.openSnackBar("Tender added successfully", "✔");
      })
    }
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      direction: 'ltr',
      panelClass: 'snackbar'
    });
  }

  sendData(tender) {
    this.tenderMode = 'edit';
    this.tender = tender;
    this.tenderForm.patchValue({
      ...tender,
      category: tender.category._id
    });
    this.image = this.tender.image;
    this.coverImage = this.tender.coverImage;
    this.video = this.tender.video;
    this.files = this.tender.files;
    this.files = tender.files;
    window.scrollTo(0, 0)
  }

  cancel() {
    this.tenderForm.reset();
    this.tenderMode = 'list';
    this.tender = null;
    this.image = null;
    this.coverImage = null;
    this.video = null;
    this.files = null;
    window.scrollTo(0, 0)
  }


  uploadImage(file: any) {
    this.image = file;
  }

  deleteImage(fileName: string) {
    this.image = undefined;
  }

  uploadCoverImage(file: any) {
    this.coverImage = file;
  }

  deleteCoverImage(fileName: string) {
    this.coverImage = undefined;
  }

  uploadVideo(file: any) {
    this.video = file;
  }

  deleteVideo(fileName: string) {
    this.video = undefined;
  }

  getDocuments(file: any) {
    this.files.push({
      filename: file.response.filename,
      url: file.response.url,
      original_name: file.name,
      response: {
        filename: file.response.filename,
      }
    })
  }

  deleteDocument(fileName: string) {
    const index = this.files.findIndex(item => item.filename === fileName)
    this.files.splice(index, 1);
    this._changeDetectorRef.markForCheck();
  }

  openAddLang(property: string): void {
    const dialogRef = this._matDialog.open(TranslateModalComponent, {
      data: this.tenderForm.get(property).getRawValue()
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tenderForm.get(property).setValue(result);
      }
    });
  }

}
