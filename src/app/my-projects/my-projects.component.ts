import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Project } from 'app/types/project.types';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectService } from 'app/services/project.service';
import { ApiService } from 'app/services/api.service';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { TranslateModalComponent } from 'app/translate-modal/translate-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

  @Input() projects: Project[];

  projectMode: string = 'list';
  projectForm: UntypedFormGroup;

  files: any[] = [];
  image: any;
  coverImage: any;
  video: any;

  categories: any[] = [];
  activeLang: string;
  project: any = {};
  availableLangs: AvailableLangs;
  formErrors = {
    title: "",
    category: "",
    shortDescription: "",
    description: "",
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
  };

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _projectService: ProjectService,
    private snackBar: MatSnackBar,
    private _apiService: ApiService,
    private _translocoService: TranslocoService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.translocoFN();
    this._apiService.getCategories(['Projects']).subscribe((categories) => {
      this.categories = categories;
      this.createForm();
    })
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
    this.projectForm = this._formBuilder.group({
      title: new FormGroup(res, Validators.required),
      shortDescription: new FormGroup(res1, Validators.required),
      description: new FormGroup(res2),
      category: ['', Validators.required],
      links: this._formBuilder.array([]),
    });

    this.projectForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.projectForm) {
      return;
    }
    const form = this.projectForm;
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

  addLinkField(): void {
    const linkFormGroup = this._formBuilder.group({
      link: ['', [Validators.required]],
      title: ['', [Validators.required]]
    });
    (this.projectForm.get('links') as UntypedFormArray).push(linkFormGroup);
    this._changeDetectorRef.markForCheck();
  }

  removeLinkField(index: number): void {
    const linksFormArray = this.projectForm.get('links') as UntypedFormArray;
    linksFormArray.removeAt(index);
    this._changeDetectorRef.markForCheck();
  }

  onSubmit() {
    this.projectForm.disable();
    for (const key in this.projectForm.get('title').getRawValue()) {
      if (this.projectForm.get('title').getRawValue()[key] == '') {
        this.projectForm.get('title').get(key).setValue(this.projectForm.get('title').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.projectForm.get('shortDescription').getRawValue()) {
      if (this.projectForm.get('shortDescription').getRawValue()[key] == '') {
        this.projectForm.get('shortDescription').get(key).setValue(this.projectForm.get('shortDescription').getRawValue()[this.activeLang]);
      }
    }

    for (const key in this.projectForm.get('description').getRawValue()) {
      if (this.projectForm.get('description').getRawValue()[key] == '') {
        this.projectForm.get('description').get(key).setValue(this.projectForm.get('description').getRawValue()[this.activeLang]);
      }
    }

    const data = {
      ...this.projectForm.getRawValue(),
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

    if (this.projectMode == 'edit') {
      this._projectService.updateProject(this.project._id, data).subscribe((updatedProject) => {
        this.projectForm.enable();
        const index = this.projects.findIndex((el) => el._id == this.project._id);
        this.projects[index] = updatedProject;
        this.cancel();
        this.openSnackBar("Project updated successfully", "✔");
      })
    }
    else {
      this._projectService.createProject(data).subscribe((newProject) => {
        this.projects.push(newProject);
        this.projectForm.enable();
        this.cancel()
        this.openSnackBar("Project added successfully", "✔");
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

  sendData(project) {
    this.projectMode = 'edit';
    this.project = project;
    this.projectForm.patchValue({
      ...project,
      category: project.category._id
    });
    this.image = this.project.image;
    this.coverImage = this.project.coverImage;
    this.video = this.project.video;
    this.files = this.project.files;

    const linkFormGroups = [];
    if (project.links.length > 0) {
      project.links.forEach((link) => {
        linkFormGroups.push(
          this._formBuilder.group({
            link: [link.link, [Validators.required]],
            title: [link.title, [Validators.required]]
          })
        );
      });
    }
    window.scrollTo(0, 0)
  }

  cancel() {
    this.projectForm.reset();
    this.projectMode = 'list';
    this.project = null;
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
      data: this.projectForm.get(property).getRawValue()
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectForm.get(property).setValue(result);
      }
    });
  }

}
