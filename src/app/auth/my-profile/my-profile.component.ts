import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { Tender } from 'app/types/tender.types';
import { TenderService } from 'app/services/tender.service';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/types/project.types';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  selectedPanel: string = "general";
  profileForm: UntypedFormGroup;

  user: User;
  image: any;

  singleCVData: any;
  singleJobData: any;

  tenders: Tender[] = [];
  projects: Project[] = [];

  lists: any[] = [
    {
      name: 'general',
      roles: ["superAdmin", "admin", "ngo", "user", "business", "student"]
    },
    {
      name: 'cvs',
      roles: ["superAdmin", "admin", "user", "student"]
    },
    {
      name: 'jobs',
      roles: ["superAdmin", "admin", "ngo", "business"]
    },
    {
      name: 'projects',
      roles: ["superAdmin", "admin", "ngo", "business"]
    },
    {
      name: 'tenders',
      roles: ["superAdmin", "admin", "ngo", "business"]
    },
  ]

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  formErrors = {
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: ""
  };

  validationMessages = {
    name: {
      required: "Name is required.",
    },
    lastname: {
      required: "Lastname is required.",
    },
    phoneNumber: {
      required: "Phone Number is required.",
    },
    email: {
      required: "Email is required.",
      email: "The email format is incorrect"
    },
    password: {
      required: "Password is required.",
      minlength: "Password length must be at least 6 character"
    },
  };


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private _tenderService: TenderService,
    private _projectService: ProjectService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.user = user;
        this._tenderService.getTenders(this.user._id).subscribe((tenders) => {
          this.tenders = tenders;
        })
        this._projectService.getProjects(this.user._id).subscribe((projects) => {
          this.projects = projects;
        })
        this.createForm();
        this.profileForm.patchValue(this.user)
        this._changeDetectorRef.markForCheck();
      });


  }

  createForm() {
    this.profileForm = this._formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthDate: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: ['', Validators.required],
    }
    );

    this.profileForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.profileForm) {
      return;
    }
    const form = this.profileForm;
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

  save() {
    this.profileForm.disable();
    const body = {
      ...this.profileForm.getRawValue(),
      avatar: this.image
    }
    this._userService.updateUser(this.user._id, body).subscribe((response) => {
      this.openSnackBar("Your information updated successfully", "✔");
      this.profileForm.enable();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    })
  }

  changePanel(panelName: string) {
    this.selectedPanel = panelName;
  }

  uploadFile(file: any) {
    this.image = file;
  }

  deleteFile(fileName: string) {
    console.log(fileName);
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      direction: 'ltr',
      panelClass: 'snackbar'
    });
  }

  addCv() {
    this.selectedPanel = 'add-cvs';
    this.singleCVData = null
  }

  setCvData(event) {
    this.singleCVData = event;
    this.selectedPanel = 'add-cvs';
  }


  addJob() {
    this.selectedPanel = 'add-jobs';
    this.singleJobData = null
  }

  setJobData(event) {
    this.singleJobData = event;
    this.selectedPanel = 'add-jobs';
  }

  showList(listName): boolean {
    const list = this.lists.find((el) => el.name == listName)
    if (this.user.roles.some((role) => ["admin", "superAdmin"].includes(role))) {
      return true
    }
    else {
      return list.roles.some((role) => this.user.roles.includes(role));
    }
  }

}
