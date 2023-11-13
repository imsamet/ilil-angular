import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { JobService } from 'app/services/job.service';
import { Job } from 'app/types/job.types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from 'app/core/user/user.types';
import { ApiService } from 'app/services/api.service';
import { UserService } from 'app/core/user/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AutoComplateService } from 'app/services/auto-complete.service';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { TranslateModalComponent } from 'app/translate-modal/translate-modal.component';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {

  job: Job;
  user: User;
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _jobService: JobService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private _userServecies: UserService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this.getUser()
    this._jobService.job$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((job: Job) => {
        this.job = job;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  getUser() {
    this._userServecies.user$.subscribe((user) => {
      this.user = user;
    });
  }


  openFormDialog() {
    this._matDialog.open(PostJobDialog, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        job: this.job._id
      }
    })
  }

}


@Component({
  selector: 'post-job-dialog',
  templateUrl: 'post-job-dialog.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class PostJobDialog implements OnInit {

  cvForm: UntypedFormGroup;
  locations: any[] = [];
  categories: any[] = [];
  image: any;
  coverImage: any;
  video: any;
  user: User;
  types: any[] = [];
  typeName: string[] = [];
  files: any[] = [];
  cvs: any[] = [];
  cv: any;
  mode: string = 'list';
  activeLang: string;
  filteredOptions: Observable<any[]>;
  availableLangs: AvailableLangs;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _apiServices: ApiService,
    private _userServecies: UserService,
    public snackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<PostJobDialog>,
    public autoComplateService: AutoComplateService,
    private _translocoService: TranslocoService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.translocoFN();
    this.createForm();
    this.getLocations();
    this.getCategories();
    this.getUser();
    this.types = [{ name: "hybrid" }, { name: "full-time" }, { name: "part-time" }, { name: "online" }, { name: "by-project" }];
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
    this.cvForm = this._formBuilder.group({
      title: new FormGroup(res, Validators.required),
      shortDescription: new FormGroup(res1, Validators.required),
      description: new FormGroup(res2),
      category: ["", [Validators.required]],
      location: ["", [Validators.required]],
      types: ["full-time", [Validators.required]],
      salaryType: ["hourly", [Validators.required]],
      expectedSalary: [0, [Validators.required]],
      educationHistory: this._formBuilder.array([]),
      jobHistory: this._formBuilder.array([]),
    });
    this.AddEducationHistory();
    this.AddJobHistory();
  }

  translocoFN() {
    this.availableLangs = this._translocoService.getAvailableLangs();
    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  AddEducationHistory() {
    const educationHistoryGroup = this._formBuilder.group({
      title: ["", [Validators.required]],
      schoolName: ["", [Validators.required]],
      startDate: [{ value: "", disabled: true }, [Validators.required]],
      endDate: [{ value: "", disabled: true }],
      details: [""],
    });
    (this.cvForm.get("educationHistory") as UntypedFormArray).push(educationHistoryGroup);
    this._changeDetectorRef.markForCheck();
  }

  removeEducationHistory(index: number): void {
    const educationHistoryArray = this.cvForm.get("educationHistory") as UntypedFormArray;
    educationHistoryArray.removeAt(index);
    this._changeDetectorRef.markForCheck();
  }

  AddJobHistory() {
    const jobHistoryGroup = this._formBuilder.group({
      title: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      startDate: [{ value: "", disabled: true }, [Validators.required]],
      endDate: [{ value: "", disabled: true }],
      details: [""],
    });
    (this.cvForm.get("jobHistory") as UntypedFormArray).push(jobHistoryGroup);
    this._changeDetectorRef.markForCheck();
  }

  removeJobHistory(index: number): void {
    const jobHistoryArray = this.cvForm.get("jobHistory") as UntypedFormArray;

    jobHistoryArray.removeAt(index);

    this._changeDetectorRef.markForCheck();
  }

  getLocations() {
    this._apiServices.getLocatins().subscribe((locations) => {
      this.locations = locations;
    });
  }

  getCategories() {
    this._apiServices.getCategories(['Jobs']).subscribe((categories) => {
      this.categories = categories;
    });
  }

  getUser() {
    this._userServecies.user$.subscribe((user) => {
      this.user = user;
      this.getCvs();
    });
  }

  getCvs() {
    this._apiServices.getCvs(this.user._id).subscribe((cvs) => {
      this.cvs = cvs;
      if (this.cvs.length == 0) {
        this.mode = 'add'
      }
    });
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

  sendData(data) {
    this.mode = 'edit';
    this.cv = data;
    this.cvForm.patchValue({
      ...data,
      category: this.cv.category._id,
      location: this.cv.location._id,
    });
    this.image = this.cv.image;
    this.coverImage = this.cv.coverImage;
    this.video = this.cv.video;
    this.files = this.cv.files;
  }

  setMode(mode) {
    this.mode = mode;
    this.cvForm.reset();
    this.image = null;
    this.coverImage = null;
    this.video = null;
    this.files = [];
  }

  onSubmit() {
    for (const key in this.cvForm.get('title').getRawValue()) {
      if (this.cvForm.get('title').getRawValue()[key] == '') {
        this.cvForm.get('title').get(key).setValue(this.cvForm.get('title').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.cvForm.get('shortDescription').getRawValue()) {
      if (this.cvForm.get('shortDescription').getRawValue()[key] == '') {
        this.cvForm.get('shortDescription').get(key).setValue(this.cvForm.get('shortDescription').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.cvForm.get('description').getRawValue()) {
      if (this.cvForm.get('description').getRawValue()[key] == '') {
        this.cvForm.get('description').get(key).setValue(this.cvForm.get('description').getRawValue()[this.activeLang]);
      }
    }
    const data = {
      ...this.cvForm.getRawValue(),
      image: this.image
        ? {
          url: this.image.url,
          filename: this.image.filename,
        }
        : null,
      user: this.user._id,
      job: this.data.job,
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
    };

    if (this.mode == 'edit') {
      this._apiServices.updateCv(this.cv._id, data).subscribe(
        (res) => {
          this.openSnackBar("You CV posted successfully", "✔");
          this.cvForm.enable();
          this.matDialogRef.close()
        },
        (err) => {
          console.error(err);
          this.openSnackBar("Something went wrong!", "❌");
        }
      );
    }
    else {
      this._apiServices.createCv(data).subscribe(
        (res) => {
          this.openSnackBar("You CV added successfully", "✔");
          this.cvForm.enable();
          this.matDialogRef.close()
        },
        (err) => {
          console.error(err);
          this.openSnackBar("Something went wrong!", "❌");
        }
      );
    }
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: "right",
      direction: "ltr",
      panelClass: "snackbar",
    });
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


  onFocus(FormControl: string, array: any[], field: string, childForm?, i?) {
    if (childForm) {
      this.filteredOptions = this.autoComplateService.searchFun
        (((this.cvForm.get(childForm) as FormArray).controls[i] as FormGroup).controls[FormControl] as FormControl, array, field);
    }
    else {
      this.filteredOptions = this.autoComplateService.searchFun(this.cvForm.controls[FormControl] as FormControl, array, field);
    }
  }

  displayFn = id => {
    if (id) {
      const index = this.locations.findIndex(el => el._id === id);
      return this.locations[index].name;
    }
    else {
      return ''
    }
  }

  openAddLang(property: string): void {
    const dialogRef = this._matDialog.open(TranslateModalComponent, {
      data: this.cvForm.get(property).getRawValue()
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cvForm.get(property).setValue(result);
      }
    });
  }

}