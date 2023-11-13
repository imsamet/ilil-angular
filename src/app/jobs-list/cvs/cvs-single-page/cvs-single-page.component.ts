import { ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
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
import { MyCvsComponent } from "../cvs.component";

@Component({
    selector: "app-cvs-single-page",
    templateUrl: "./cvs-single-page.component.html",
    styleUrls: ["./cvs-single-page.component.scss"],
})
export class CvsSinglePageComponent implements OnInit {

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
        private _myCvsComponent: MyCvsComponent,
        public autoComplateService: AutoComplateService,
        private _translocoService: TranslocoService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.translocoFN();
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
            privacy: ["", [Validators.required]],
            title: new FormGroup(res, Validators.required),
            shortDescription: new FormGroup(res1, Validators.required),
            description: new FormGroup(res2),
            category: ["", [Validators.required]],
            location: ["", [Validators.required]],
            types: [["full-time"], [Validators.required]],
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
            this.createForm();
            if (this.data) {
                this.cvForm.patchValue({
                    ...this.data,
                    category: this.data.category._id,
                    location: this.data.location._id,
                });
                this.image = this.data.image;
                this.coverImage = this.data.coverImage;
                this.video = this.data.video;
                this.files = this.data.files;
            }
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
        this.cvForm.disable();
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
            this._apiServices.updateCv(this.data._id, data).subscribe(
                (res) => {
                    this.openSnackBar("CV updated successfully", "✔");
                    this._myCvsComponent.mode = 'list';
                    this._myCvsComponent.getCvs();
                    this.cvForm.enable();
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
                    this.openSnackBar("CV Add successfully", "✔");
                    this._myCvsComponent.mode = 'list';
                    this._myCvsComponent.getCvs();
                    this.cvForm.enable();
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
