import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {

  formErrors = {
    email: "",
    password: ""
  };

  validationMessages = {
    email: {
      required: "Email is required.",
      email: "The email format is incorrect"
    },
    password: {
      required: "Password is required.",
    },
  };


  @ViewChild('signInNgForm') signInNgForm: NgForm;

  signInForm: UntypedFormGroup;
  showAlert: boolean = false;
  message: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {

    this.signInForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: ['']
    });
    this.signInForm.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();

  }

  onValueChanged(data?: any) {
    if (!this.signInForm) {
      return;
    }
    const form = this.signInForm;
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

  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value)
      .subscribe(
        () => {

          // Set the redirect url.
          // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
          // to the correct page after a successful sign in. This way, that url can be set via
          // routing file and we don't have to touch here.
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

          // Navigate to the redirect url
          this._router.navigateByUrl(redirectURL);

        },
        (response) => {

          // Re-enable the form
          this.signInForm.enable();

          // Reset the form
          this.signInNgForm.resetForm();

          // Set the alert
          if (response.error.err) {
            if (response.error.err.name == "IncorrectUsernameError") {
              this.message = 'Account not found!';
            }
            else if (response.error.err.name == "IncorrectPasswordError") {
              this.message = 'Password is incorrect!'
            }
          }
          else {
            this.message = 'Error occurred while logging in!';
          }
          this.showAlert = true;
        }
      );
  }

}
