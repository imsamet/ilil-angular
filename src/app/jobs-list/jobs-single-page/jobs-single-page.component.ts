import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AvailableLangs, TranslocoService } from "@ngneat/transloco";
import { MyProfileComponent } from "app/auth/my-profile/my-profile.component";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { ApiService } from "app/services/api.service";
import { AutoComplateService } from "app/services/auto-complete.service";
import { TranslateModalComponent } from "app/translate-modal/translate-modal.component";
import { Observable } from "rxjs";
import { JobsListComponent } from "../jobs-list.component";

@Component({
    selector: "app-jobs-single-page",
    templateUrl: "./jobs-single-page.component.html",
    styleUrls: ["./jobs-single-page.component.scss"],
})
export class JobsSinglePageComponent {

    jobForm: UntypedFormGroup;
    locations: any[] = [];
    categories: any[] = [];
    image: any;
    coverImage: any;
    video: any;
    user: User;
    types: any[] = [];
    files: any[] = [];
    activeLang: string;
    @Input() data: any;
    availableLangs: AvailableLangs;
    filteredOptions: Observable<any[]>;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _apiServices: ApiService,
        private _userServecies: UserService,
        public snackBar: MatSnackBar,
        private _jobsListComponent: JobsListComponent,
        public autoComplateService: AutoComplateService,
        private _translocoService: TranslocoService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.types = [{ name: "hybrid" }, { name: "full-time" }, { name: "part-time" }, { name: "online" }, { name: "by-project" }];
        this.translocoFN();
        this.getLocations();
        this.getUser();
        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
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
        this.jobForm = this._formBuilder.group({
            title: new FormGroup(res, Validators.required),
            shortDescription: new FormGroup(res1, Validators.required),
            description: new FormGroup(res2),
            category: ["", [Validators.required]],
            location: ["", [Validators.required]],
            types: [["full-time"], [Validators.required]],
            salaryType: ["hourly", [Validators.required]],
            salary: [0, [Validators.required]],
            companyName: ["", [Validators.required]],
            posted: [true, [Validators.required]],
        });

        if (this.data) {
            console.log(this.data);
            this.jobForm.patchValue({
                ...this.data,
                category: this.data.category._id,
                location: this.data.location._id,
            });
            console.log(this.jobForm.getRawValue());

            this.image = this.data.image;
            this.coverImage = this.data.coverImage;
            this.video = this.data.video;
            this.files = this.data.files;
        }
    }

    getLocations() {
        this._apiServices.getLocatins().subscribe((locations) => {
            this.locations = locations;
            this.getCategories();
        });
    }

    getCategories() {
        this._apiServices.getCategories(['Jobs']).subscribe((categories) => {
            this.categories = categories;
            this.createForm();
        });
    }

    getUser() {
        this._userServecies.user$.subscribe((user) => {
            this.user = user;
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

    onSubmit() {
        this.jobForm.disable();
        for (const key in this.jobForm.get('title').getRawValue()) {
            if (this.jobForm.get('title').getRawValue()[key] == '') {
                this.jobForm.get('title').get(key).setValue(this.jobForm.get('title').getRawValue()[this.activeLang]);
            }
        }
        for (const key in this.jobForm.get('shortDescription').getRawValue()) {
            if (this.jobForm.get('shortDescription').getRawValue()[key] == '') {
                this.jobForm.get('shortDescription').get(key).setValue(this.jobForm.get('shortDescription').getRawValue()[this.activeLang]);
            }
        }
        for (const key in this.jobForm.get('description').getRawValue()) {
            if (this.jobForm.get('description').getRawValue()[key] == '') {
                this.jobForm.get('description').get(key).setValue(this.jobForm.get('description').getRawValue()[this.activeLang]);
            }
        }
        const data = {
            ...this.jobForm.getRawValue(),
            image: this.image
                ? {
                    url: this.image.url,
                    filename: this.image.filename,
                }
                : null,
            user: this.user._id,
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

        if (this.data) {
            this._apiServices.updateJob(this.data._id, data).subscribe(
                (res) => {
                    this.openSnackBar("Jobs updated successfully", "✔");
                    this._jobsListComponent.mode = 'list';
                    this._jobsListComponent.getJobs();
                    this.jobForm.enable();
                },
                (err) => {
                    console.error(err);
                    this.openSnackBar("Something went wrong!", "❌");
                }
            );
        }
        else {
            this._apiServices.createJob(data).subscribe(
                (res) => {
                    this.openSnackBar("Jobs Add successfully", "✔");
                    this._jobsListComponent.mode = 'list';
                    this._jobsListComponent.getJobs();
                    this.jobForm.enable();
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

    onFocus(FormControl: string, array: any[], field: string, childForm?, i?) {
        if (childForm) {
            this.filteredOptions = this.autoComplateService.searchFun
                (((this.jobForm.get(childForm) as FormArray).controls[i] as FormGroup).controls[FormControl] as FormControl, array, field);
        }
        else {
            this.filteredOptions = this.autoComplateService.searchFun(this.jobForm.controls[FormControl] as FormControl, array, field);
        }
    }

    displayFn = id => {
        if (id) {
            const index = this.locations.findIndex(el => el._id === id);
            console.log(index);
            return this.locations[index].name;
        }
        else {
            return ''
        }
    }

    openAddLang(property: string): void {
        const dialogRef = this._matDialog.open(TranslateModalComponent, {
            data: this.jobForm.get(property).getRawValue()
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.jobForm.get(property).setValue(result);
            }
        });
    }

}
