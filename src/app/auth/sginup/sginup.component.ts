import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { TruTedValidators } from "@truted/validators";

@Component({
  selector: 'app-sginup',
  templateUrl: './sginup.component.html',
  styleUrls: ['./sginup.component.scss']
})
export class SginupComponent implements OnInit {

  formErrors = {
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    password: "",
    passwordConfirm: ""
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
    passwordConfirm: {
      required: "Password Confirm is required.",
      mustMatch: "Passwords must match"
    },
  };


  signUpForm: UntypedFormGroup;
  showAlert: boolean = false;
  message: string;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.signUpForm = this._formBuilder.group({
      name: ['', Validators.required],
      // lastname: ['', Validators.required],
      birthDate: [new Date().toString(), Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required],
    },
      {
        validators: TruTedValidators.mustMatch("password", "passwordConfirm"),
      }
    );

    this.signUpForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.signUpForm) {
      return;
    }
    const form = this.signUpForm;
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



  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      direction: 'ltr',
      panelClass: 'snackbar'
    });
  }

  signUp(): void {
    this.signUpForm.disable();
    this._authService.signUp(this.signUpForm.getRawValue()).subscribe(
      (res) => {
        this._router.navigate(["/login"]);
        this.openSnackBar("We received your information", "✔");
        this.signUpForm.enable();
      },
      (err) => {
        if (err.error.code == 11000) {
          this.message = `This email <b>${err.error.keyValue.email}</b> is already registered, try a different one!`

        }
        else {
          this.message = err.error;
        }
        this.showAlert = true
        this.signUpForm.enable();
        this.openSnackBar("Something went wrong!", "❌");
      }
    );
  }

}
